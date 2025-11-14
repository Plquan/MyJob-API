import logger from "@/common/helpers/logger";
import IPackageService from "@/interfaces/package/package-interface";
import DatabaseService from "@/services/common/database-service";
import { ICreatePackageRequest, IPackageDto, IUpdatePackageRequest } from "@/interfaces/package/package-dto";
import PackageMapper from "@/mappers/package/package-mapper";
import { HttpException } from "@/errors/http-exception";
import { getCurrentUser } from "@/common/helpers/get-current-user";
import { Package } from "@/entities/package";
import { PackageUsage } from "@/entities/package-usage";
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
                where: { companyId: employer.companyId }
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
                const packageUsageData = PackageMapper.toCreatePackageUsage(existingPackage, companyId);
                if (existingPackageUsage) {
                    packageUsageData.id = existingPackageUsage.id;
                }
                await manager.getRepository(PackageUsage).save(packageUsageData);
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