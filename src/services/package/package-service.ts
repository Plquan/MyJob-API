import logger from "@/common/helpers/logger";
import { IResponseBase } from "@/interfaces/base/IResponseBase";
import IPackageService from "@/interfaces/package/package-interface";
import { StatusCodes } from "http-status-codes";
import DatabaseService from "@/services/common/database-service";
import { ICreatePackageRequest, IPackageDto, IUpdatePackageRequest } from "@/interfaces/package/package-dto";
import PackageMapper from "@/mappers/package/package-mapper";
import { HttpException } from "@/errors/http-exception";

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
                throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid input")
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
                throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid input")
            }
            const existingPackage = await this._context.PackageRepo.findOne({
                where: { id: data.id }
            })
            if (!existingPackage) {
                throw new HttpException(StatusCodes.NOT_FOUND, "Package not found");
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
                throw new HttpException(StatusCodes.BAD_REQUEST, "Invalid input")
            }
            const existingPackage = await this._context.PackageRepo.findOne({
                where: { id: packageId }
            })
            if (!existingPackage) {
                throw new HttpException(StatusCodes.NOT_FOUND, "Package not found");
            }
            await this._context.PackageRepo.remove(existingPackage)
            return true
        } catch (error) {
            logger.error(error?.message)
            console.log(`Error in PackageSerivce - method deletePackage() with message ${error?.message}`);
            throw error
        }
    }
    async purchasePackage(packageId: number): Promise<IResponseBase> {
        try {


        } catch (error) {
            logger.error(error?.message)
            console.log(`Error in PackageSerivce - method purchasePackage() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi mua gói, vui lòng thử lại sau",
            }
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