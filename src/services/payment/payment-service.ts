import Stripe from 'stripe';
import { ENV } from '@/common/constants/env';
import IPaymentService, {
    ICreateCheckoutSessionRequest,
    ICreateCheckoutSessionResponse,
    IPaymentWebhookEvent
} from '@/interfaces/payment/payment-interface';
import logger from '@/common/helpers/logger';
import DatabaseService from '@/services/common/database-service';
import { HttpException } from '@/errors/http-exception';
import { StatusCodes } from '@/common/enums/status-code/status-code.enum';
import { EGlobalError } from '@/common/enums/error/EGlobalError';
import { Package } from '@/entities/package';
import { PackagePurchases } from '@/entities/package-purchases';
import { PackageUsage } from '@/entities/package-usage';
import PackageMapper from '@/mappers/package/package-mapper';

export default class PaymentService implements IPaymentService {
    private stripe: Stripe;
    private readonly _context: DatabaseService;

    constructor(DatabaseService: DatabaseService) {
        if (!ENV.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not configured in environment variables');
        }

        this.stripe = new Stripe(ENV.STRIPE_SECRET_KEY);
        this._context = DatabaseService;
    }

    async createCheckoutSession(data: ICreateCheckoutSessionRequest): Promise<ICreateCheckoutSessionResponse> {
        try {
            const packageData = await this._context.PackageRepo.findOne({
                where: { id: data.packageId }
            });

            if (!packageData) {
                throw new HttpException(
                    StatusCodes.NOT_FOUND,
                    EGlobalError.ResourceNotFound,
                    'Package not found'
                );
            }

            const STRIPE_VND_MAX_AMOUNT = 99999999;
            const packagePrice = Number(packageData.price);

            if (packagePrice > STRIPE_VND_MAX_AMOUNT) {
                throw new HttpException(
                    StatusCodes.BAD_REQUEST,
                    EGlobalError.InvalidInput,
                    `Giá gói (${packagePrice.toLocaleString('vi-VN')} VND) vượt quá giới hạn thanh toán của Stripe (${STRIPE_VND_MAX_AMOUNT.toLocaleString('vi-VN')} VND). Vui lòng liên hệ quản trị viên để được hỗ trợ.`
                );
            }

            const companyId = data.companyId;
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'vnd',
                            product_data: {
                                name: packageData.name,
                                description: packageData.description || '',
                            },
                            unit_amount: Math.round(packagePrice * 100),
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: data.successUrl,
                cancel_url: data.cancelUrl,
                metadata: {
                    packageId: data.packageId.toString(),
                    companyId: companyId ? companyId.toString() : '',
                },
            });

            logger.info(`Stripe checkout session created: ${session.id} for package ${data.packageId}, company ${companyId}`);

            return {
                sessionId: session.id,
                url: session.url || '',
            };
        } catch (error: any) {
            throw error
        }
    }

    constructWebhookEvent(payload: string | Buffer, signature: string): IPaymentWebhookEvent {
        try {
            if (!ENV.STRIPE_WEBHOOK_SECRET) {
                throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
            }

            const event = this.stripe.webhooks.constructEvent(
                payload,
                signature,
                ENV.STRIPE_WEBHOOK_SECRET
            ) as any;

            return {
                id: event.id,
                type: event.type,
                data: {
                    object: event.data.object,
                },
            };
        } catch (error: any) {
            logger.error('Error constructing webhook event:', error);
            throw new HttpException(
                StatusCodes.BAD_REQUEST,
                EGlobalError.InvalidInput,
                `Webhook signature verification failed: ${error.message}`
            );
        }
    }

    async handlePaymentSuccess(sessionId: string): Promise<void> {
        const dataSource = this._context.getDataSource();
        try {
            // Retrieve the session from Stripe
            const session = await this.stripe.checkout.sessions.retrieve(sessionId);

            if (session.payment_status !== 'paid') {
                throw new HttpException(
                    StatusCodes.BAD_REQUEST,
                    EGlobalError.InvalidInput,
                    'Payment not completed'
                );
            }

            const packageId = parseInt(session.metadata?.packageId || '0');
            const companyId = session.metadata?.companyId
                ? parseInt(session.metadata.companyId)
                : null;

            if (!packageId) {
                throw new HttpException(
                    StatusCodes.BAD_REQUEST,
                    EGlobalError.InvalidInput,
                    'Package ID not found in session metadata'
                );
            }

            if (!companyId) {
                throw new HttpException(
                    StatusCodes.BAD_REQUEST,
                    EGlobalError.InvalidInput,
                    'Company ID not found in session metadata'
                );
            }

            // Use transaction to ensure data consistency
            await dataSource.transaction(async (manager) => {
                // Get package details
                const packageData = await manager.getRepository(Package).findOne({
                    where: { id: packageId }
                });

                if (!packageData) {
                    throw new HttpException(
                        StatusCodes.NOT_FOUND,
                        EGlobalError.ResourceNotFound,
                        'Package not found'
                    );
                }

                // Create PackagePurchases record
                const packagePurchase = new PackagePurchases();
                packagePurchase.companyId = companyId;
                packagePurchase.packageId = packageId;
                packagePurchase.price = Number(packageData.price);
                packagePurchase.paymentMethod = 'stripe';
                packagePurchase.paymentDate = new Date();

                // Calculate dates
                const startDate = new Date();
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + packageData.durationInDays);

                packagePurchase.startDate = startDate;
                packagePurchase.endDate = endDate;

                await manager.getRepository(PackagePurchases).save(packagePurchase);

                // Update or create PackageUsage
                const existingPackageUsage = await manager.getRepository(PackageUsage).findOne({
                    where: { companyId }
                });

                const packageUsageData = PackageMapper.toCreatePackageUsage(packageData, companyId);
                if (existingPackageUsage) {
                    packageUsageData.id = existingPackageUsage.id;
                }

                await manager.getRepository(PackageUsage).save(packageUsageData);

                logger.info(`Payment successful - Created purchase record and updated package usage for session ${sessionId}, package ${packageId}, company ${companyId}`);
            });

        } catch (error: any) {
            logger.error(`Error handling payment success for session ${sessionId}:`, error);
            throw error
        }
    }

    async handlePaymentFailed(sessionId: string): Promise<void> {
        try {
            logger.warn(`Payment failed for session ${sessionId}`);
        } catch (error: any) {
            throw error
        }
    }
}

