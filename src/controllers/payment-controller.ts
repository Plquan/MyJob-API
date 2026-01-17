import { Auth } from "@/common/middlewares";
import IPaymentService from "@/interfaces/payment/payment-interface";
import { route, POST, before, inject } from "awilix-express";
import { Request, Response } from "express";
import { getCurrentUser } from "@/common/helpers/get-current-user";
import logger from "@/common/helpers/logger";

@route('/payment')
export class PaymentController {
    private readonly _paymentService: IPaymentService;

    constructor(PaymentService: IPaymentService) {
        this._paymentService = PaymentService;
    }

    @before(inject(Auth.required))
    @POST()
    @route('/create-checkout-session')
    async createCheckoutSession(req: Request, res: Response) {
        try {
            const { packageId, successUrl, cancelUrl } = req.body;

            if (!packageId || !successUrl || !cancelUrl) {
                return res.status(400).json({
                    error: 'Missing required fields: packageId, successUrl, cancelUrl'
                });
            }

            const currentUser = getCurrentUser();
            if (!currentUser || !currentUser.companyId) {
                return res.status(401).json({
                    error: 'Company ID not found. User must be associated with a company.'
                });
            }

            const session = await this._paymentService.createCheckoutSession({
                packageId: Number(packageId),
                companyId: currentUser.companyId,
                successUrl,
                cancelUrl,
            });

            res.status(200).json(session);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                error: error.message || 'Failed to create checkout session'
            });
        }
    }

    @POST()
    @route('/webhook')
    async handleWebhook(req: Request, res: Response) {
        try {
            const signature = req.headers['stripe-signature'] as string;

            if (!signature) {
                return res.status(400).json({ error: 'Missing stripe-signature header' });
            }

            const event = this._paymentService.constructWebhookEvent(
                req.body as Buffer,
                signature
            );

            switch (event.type) {
                case 'checkout.session.completed':
                    const session = event.data.object;
                    if (session.payment_status === 'paid') {
                        await this._paymentService.handlePaymentSuccess(session.id);
                    } else {
                        logger.info(`Session ${session.id} completed but payment_status is ${session.payment_status}, waiting for async payment event`);
                    }
                    break;
                case 'checkout.session.async_payment_succeeded':
                    await this._paymentService.handlePaymentSuccess(
                        event.data.object.id
                    );
                    break;
                case 'checkout.session.async_payment_failed':
                    await this._paymentService.handlePaymentFailed(
                        event.data.object.id
                    );
                    break;
                case 'checkout.session.expired':
                    await this._paymentService.handlePaymentFailed(
                        event.data.object.id
                    );
                    break;
                case 'payment_intent.payment_failed':
                    await this._paymentService.handlePaymentFailed(
                        event.data.object.session || event.data.object.id
                    );
                    break;
                default:
                    logger.info(`Unhandled event type: ${event.type}`);
            }

            res.status(200).json({ received: true });
        } catch (error: any) {
            logger.error('Webhook error:', error);
            res.status(error.statusCode || 400).json({
                error: error.message || 'Webhook handler failed'
            });
        }
    }
}

