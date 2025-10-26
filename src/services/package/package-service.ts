import logger from "@/common/helpers/logger";
import IPackageService from "@/interfaces/package/package-interface";
import DatabaseService from "@/services/common/database-service";
import { ICreatePackageRequest, IPackageDto, IUpdatePackageRequest } from "@/interfaces/package/package-dto";
import PackageMapper from "@/mappers/package/package-mapper";
import { HttpException } from "@/errors/http-exception";
import { getCurrentUser } from "@/common/helpers/get-current-user";
import { ErrorMessages } from "@/common/constants/ErrorMessages";
import { Package } from "@/entities/package";
import { PackageUsage } from "@/entities/package-usage";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { EGlobalError } from "@/common/enums/error/EGlobalError";

export default class PackageService implements IPackageService {
    private readonly _context: DatabaseService
    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
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
            logger.error(error?.message)
            console.log(`Error in PackageSerivce - method getAllPackages() with message ${error?.message}`);
            throw error
        }
    }
    async createPackage(data: ICreatePackageRequest): Promise<IPackageDto> {
        try {
            if (!data.name || !data.price || !data.durationInDays) {
                throw new HttpException(StatusCodes.BAD_REQUEST,EGlobalError.InvalidInput, "Invalid input")
            }
            const newPackage = this._context.PackageRepo.create(data)
            await this._context.PackageRepo.save(newPackage)
            return PackageMapper.toPackageDto(newPackage)
        } catch (error) {
            logger.error(error?.message)
            console.log(`Error in PackageSerivce - method createPackage() with message ${error?.message}`);
            throw error
        }
    }
    async updatePackage(data: IUpdatePackageRequest): Promise<IPackageDto> {
        try {
            if (!data.id) {
                throw new HttpException(StatusCodes.BAD_REQUEST,EGlobalError.InvalidInput, "Invalid input")
            }
            const existingPackage = await this._context.PackageRepo.findOne({
                where: { id: data.id }
            })
            if (!existingPackage) {
                throw new HttpException(StatusCodes.NOT_FOUND,EGlobalError.ResourceNotFound, "Package not found");
            }
            const updatedPackage = this._context.PackageRepo.merge(existingPackage, data)
            await this._context.PackageRepo.save(updatedPackage)
            return PackageMapper.toPackageDto(updatedPackage)

        } catch (error) {
            logger.error(error?.message)
            console.log(`Error in PackageSerivce - method updatePackage() with message ${error?.message}`);
            throw error
        }
    }
    async deletePackage(packageId: number): Promise<boolean> {
        try {
            if (!packageId) {
                throw new HttpException(StatusCodes.BAD_REQUEST,EGlobalError.InvalidInput, "Invalid input")
            }
            const existingPackage = await this._context.PackageRepo.findOne({
                where: { id: packageId }
            })
            if (!existingPackage) {
                throw new HttpException(StatusCodes.NOT_FOUND,EGlobalError.ResourceNotFound, "Package not found");
            }
            await this._context.PackageRepo.remove(existingPackage)
            return true
        } catch (error) {
            logger.error(error?.message)
            console.log(`Error in PackageSerivce - method deletePackage() with message ${error?.message}`);
            throw error
        }
    }
    async purchasePackage(packageId: number): Promise<boolean> {
        const dataSource = this._context.getDataSource();
        try {
            return await dataSource.transaction(async (manager) => {
                const companyId = getCurrentUser().companyId;
                if (!companyId) {
                    throw new HttpException(StatusCodes.UNAUTHORIZED,EGlobalError.InvalidInput, ErrorMessages.UNAUTHORIZED);
                }
                const [existingPackage, existingPackageUsage] = await Promise.all([
                    manager.getRepository(Package).findOne({ where: { id: packageId } }),
                    manager.getRepository(PackageUsage).findOne({ where: { companyId } }),
                ]);
                if (!existingPackage) {
                    throw new HttpException(StatusCodes.NOT_FOUND,EGlobalError.ResourceNotFound, ErrorMessages.NOT_FOUND);
                }
                const packageUsageData = PackageMapper.toCreatePackageUsage(existingPackage, companyId);
                if (existingPackageUsage) {
                    packageUsageData.id = existingPackageUsage.id;
                }
                await manager.getRepository(PackageUsage).save(packageUsageData);
                return true;
            });
        } catch (error) {
            logger.error(error?.message);
            console.log(`Error in PackageSerivce - method purchasePackage() with message ${error?.message}`);
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
            logger.error(error?.message)
            console.log(`Error in PackageSerivce - method getPackages() with message ${error?.message}`);
            throw error
        }
    }
}