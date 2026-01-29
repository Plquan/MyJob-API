import logger from "@/common/helpers/logger";
import IPackageService from "@/interfaces/package/package-interface";
import DatabaseService from "@/services/common/database-service";
import { ICreatePackageRequest, IPackageDto, IUpdatePackageRequest } from "@/interfaces/package/package-dto";
import PackageMapper from "@/mappers/package/package-mapper";
import { HttpException } from "@/errors/http-exception";
import { getCurrentUser } from "@/common/helpers/get-current-user";
import { Package } from "@/entities/package";
import { PackageUsage } from "@/entities/package-usage";
import { Company } from "@/entities/company";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { EGlobalError } from "@/common/enums/error/EGlobalError";
import { EAuthError } from "@/common/enums/error/EAuthError";

export default class PackageService implements IPackageService {
    private readonly _context: DatabaseService
    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
    }
    async getCompanyPackage(): Promise<PackageUsage> {
        try {
            const employer = getCurrentUser()
            if (!employer) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "employer not found")
            }
            const companyPackage = await this._context.PackageUsageRepo.findOne({
                where: { companyId: employer.companyId },
                relations: ['package']
            })
            return companyPackage
        } catch (error) {
            throw error
        }
    }
    async getAllPackages(): Promise<IPackageDto[]> {
        try {
            const packages = await this._context.PackageRepo.find({
                order: {
                    createdAt: 'DESC'
                }
            })
            return PackageMapper.toPackageDtoList(packages)
        } catch (error) {
            throw error
        }
    }
    async createPackage(data: ICreatePackageRequest): Promise<IPackageDto> {
        try {
            if (!data.name || !data.price || !data.durationInDays) {
                throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Invalid input")
            }
            const newPackage = this._context.PackageRepo.create(data)
            await this._context.PackageRepo.save(newPackage)
            return PackageMapper.toPackageDto(newPackage)
        } catch (error) {
            throw error
        }
    }
    async updatePackage(data: IUpdatePackageRequest): Promise<IPackageDto> {
        try {
            if (!data.id) {
                throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "package id not found")
            }
            const existingPackage = await this._context.PackageRepo.findOne({
                where: { id: data.id }
            })
            if (!existingPackage) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Existing package not found");
            }
            const updatedPackage = this._context.PackageRepo.merge(existingPackage, data)
            await this._context.PackageRepo.save(updatedPackage)
            return PackageMapper.toPackageDto(updatedPackage)

        } catch (error) {
            throw error
        }
    }
    async deletePackage(packageId: number): Promise<boolean> {
        try {
            if (!packageId) {
                throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Package id not found")
            }
            const existingPackage = await this._context.PackageRepo.findOne({
                where: { id: packageId }
            })
            if (!existingPackage) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "existing package not found");
            }
            await this._context.PackageRepo.remove(existingPackage)
            return true
        } catch (error) {
            throw error
        }
    }
    async purchasePackage(packageId: number): Promise<boolean> {
        const dataSource = this._context.getDataSource();
        try {
            return await dataSource.transaction(async (manager) => {
                const companyId = getCurrentUser().companyId;
                if (!companyId) {
                    throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.InvalidInput, "company id not found");
                }
                const [existingPackage, existingPackageUsage] = await Promise.all([
                    manager.getRepository(Package).findOne({ where: { id: packageId } }),
                    manager.getRepository(PackageUsage).findOne({ where: { companyId } }),
                ]);
                if (!existingPackage) {
                    throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "existing package not found");
                }
                const newPackageUsageData = PackageMapper.toCreatePackageUsage(existingPackage, companyId);
                
                if (existingPackageUsage) {
                    // Cộng dồn remaining values
                    newPackageUsageData.id = existingPackageUsage.id;
                    newPackageUsageData.candidateSearchRemaining = existingPackageUsage.candidateSearchRemaining + newPackageUsageData.candidateSearchRemaining;
                    newPackageUsageData.jobPostRemaining = existingPackageUsage.jobPostRemaining + newPackageUsageData.jobPostRemaining;
                    
                    // Lấy expiryDate xa hơn (max giữa existing và new)
                    if (existingPackageUsage.expiryDate && newPackageUsageData.expiryDate) {
                        newPackageUsageData.expiryDate = existingPackageUsage.expiryDate > newPackageUsageData.expiryDate 
                            ? existingPackageUsage.expiryDate 
                            : newPackageUsageData.expiryDate;
                    }
                    
                    // Lấy duration lớn hơn (max giữa existing và new)
                    newPackageUsageData.jobPostDurationInDays = Math.max(
                        existingPackageUsage.jobPostDurationInDays, 
                        newPackageUsageData.jobPostDurationInDays
                    );
                    newPackageUsageData.jobHotDurationInDays = Math.max(
                        existingPackageUsage.jobHotDurationInDays, 
                        newPackageUsageData.jobHotDurationInDays
                    );
                    newPackageUsageData.highlightCompanyDurationInDays = Math.max(
                        existingPackageUsage.highlightCompanyDurationInDays, 
                        newPackageUsageData.highlightCompanyDurationInDays
                    );
                }
                
                await manager.getRepository(PackageUsage).save(newPackageUsageData);

                // Update Company hotExpiredAt - cộng dồn thời gian
                const company = await manager.getRepository(Company).findOne({
                    where: { id: companyId }
                });

                if (company) {
                    const newHotExpiredAt = new Date();
                    newHotExpiredAt.setDate(newHotExpiredAt.getDate() + existingPackage.highlightCompanyDurationInDays);
                    
                    // Nếu đã có hotExpiredAt và còn hạn, cộng dồn; nếu không lấy ngày mới
                    if (company.hotExpiredAt && company.hotExpiredAt > new Date()) {
                        // Cộng dồn thời gian từ ngày hiện tại của hotExpiredAt
                        const additionalDays = existingPackage.highlightCompanyDurationInDays;
                        company.hotExpiredAt.setDate(company.hotExpiredAt.getDate() + additionalDays);
                    } else {
                        // Nếu đã hết hạn hoặc chưa có, set ngày mới
                        company.hotExpiredAt = newHotExpiredAt;
                    }
                    
                    await manager.getRepository(Company).save(company);
                }

                return true;
            });
        } catch (error) {
            throw error;
        }
    }
    async getPackages(): Promise<IPackageDto[]> {
        try {
            const packages = await this._context.PackageRepo.find({
                where: { isActive: true },
                order: {
                    createdAt: 'DESC'
                }
            })
            return PackageMapper.toPackageDtoList(packages)
        } catch (error) {
            throw error
        }
    }
}