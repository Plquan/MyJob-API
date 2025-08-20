import logger from "@/common/helpers/logger";
import { IResponseBase } from "@/interfaces/base/IResponseBase";
import IPackageService from "@/interfaces/package/package-interface";
import { StatusCodes } from "http-status-codes";
import DatabaseService from "@/services/common/database-service";
import { ICreatePackageData, IPackageFeatureData, IUpdatePackageData } from "@/dtos/package/package-dto";

export default class PackageService implements IPackageService {

    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
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
    async getAllPackagesWithFeatures(): Promise<IResponseBase> {
        try {

            const packages = await this._context.PackageRepo
                .createQueryBuilder("pkg")
                .innerJoin("pkg.packageFeatures", "pf")
                .select([
                    `pkg.id AS "id"`,
                    `pkg.name AS "name"`,
                    `pkg.price AS "price"`,
                    `pkg.durationInDays AS "durationInDays"`,
                    `json_agg(pf.description) AS "features"`
                ])
                .where("pkg.isActive = :isActive", { isActive: true })
                .groupBy("pkg.id, pkg.name, pkg.createdAt")
                .orderBy("pkg.createdAt", "DESC")
                .getRawMany()

            return {
                status: StatusCodes.OK,
                success: true,
                message: "Lấy danh sách gói kèm tính năng thành công",
                data: packages
            }

        } catch (error) {
            logger.error(error?.message)
            console.log(`Error in PackageSerivce - method getAllPackagesWithFeatures() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi lấy gói kèm tính năng, vui lòng thử lại sau",
            }
        }
    }
    async updatePackageFeatures(data: IPackageFeatureData[], packageId: number): Promise<IResponseBase> {
        try {
            if (!packageId) {
                return {
                    status: StatusCodes.BAD_REQUEST,
                    message: "Vui lòng kiểm tra lại dữ liệu của bạn",
                    success: false,
                }
            }

            for (const item of data) {
                if (
                    !item.featureId ||
                    !item.packageId ||
                    (item.unlimited === false && item.quota <= 0)
                ) {
                    return {
                        status: StatusCodes.BAD_REQUEST,
                        message: "Vui lòng kiểm tra lại dữ liệu của bạn.",
                        success: false
                    }
                }
            }

            await this._context.PackageFeatureRepo.delete({ packageId })
            if (data.length > 0) {
                const newfeaturesOfPackage = await this._context.PackageFeatureRepo.create(data)
                await this._context.PackageFeatureRepo.save(newfeaturesOfPackage)
            }

            return {
                status: StatusCodes.OK,
                message: "Cập nhật tính năng gói thành công",
                success: true
            }
        } catch (error) {
            logger.error(error?.message)
            console.log(`Error in PackageSerivce - method updatePackageFeature() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi cập nhật tính năng gói, vui lòng thử lại sau",
            }
        }
    }
    async getPackageFeatures(packageId: number): Promise<IResponseBase> {
        try {
            if (!packageId) {
                return {
                    status: StatusCodes.BAD_REQUEST,
                    message: "Vui lòng kiểm tra lại dữ liệu của bạn",
                    success: false,
                }
            }

            const packageWithDetails = await this._context.PackageRepo.findOne({
                where: { id: packageId },
                relations: ['packageFeatures', 'packageFeatures.feature'],
            });

            if (!packageWithDetails) {
                throw new Error("Package not found")
            }

           


            return {
                status: StatusCodes.OK,
                message: "Lấy danh sách tính năng thuộc gói thành công",
                success: true,
                data: null
            }
        } catch (error) {
            logger.error(error?.message)
            console.log(`Error in PackageSerivce - method getFeaturesOfPackage() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi lấy danh sách tính năng thuộc gói, vui lòng thử lại sau",
            }
        }
    }
    async getAllPackages(): Promise<IResponseBase> {
        try {
            const packages = await this._context.PackageRepo.find()
            return {
                status: StatusCodes.OK,
                message: "Lấy danh sách thành công",
                success: true,
                data: packages
            }

        } catch (error) {
            logger.error(error?.message)
            console.log(`Error in PackageSerivce - method getAllPackages() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi lấy danh sách gói, vui lòng thử lại sau",
            }
        }
    }
    async createPackage(data: ICreatePackageData): Promise<IResponseBase> {
        try {
            if (!data.name || !data.price) {
                return {
                    status: StatusCodes.BAD_REQUEST,
                    message: "Vui lòng kiểm tra lại dữ liệu của bạn",
                    success: false
                }
            }

            const newPackage = await this._context.PackageRepo.create(data)
            await this._context.PackageRepo.save(newPackage)

            return {
                status: StatusCodes.CREATED,
                message: "Thêm gói dịch vụ mới thành công",
                success: true,
                data: newPackage
            }

        } catch (error) {
            logger.error(error?.message)
            console.log(`Error in PackageSerivce - method getAllPackages() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi tạo gói, vui lòng thử lại sau",
            }
        }
    }
    async updatePackage(data: IUpdatePackageData): Promise<IResponseBase> {
        try {
            if (!data.id || !data.name || !data.price) {
                return {
                    status: StatusCodes.BAD_REQUEST,
                    message: "Vui lòng kiểm tra lại dữ liệu của bạn",
                    success: false
                }
            }
            const pkg = await this._context.PackageRepo.findOne({
                where: { id: data.id }
            })
            if (!pkg) {
                return {
                    status: StatusCodes.NOT_FOUND,
                    message: "Không tìm thấy gói dịch vụ",
                    success: false
                }
            }
            this._context.PackageRepo.merge(pkg, data)
            await this._context.PackageRepo.save(pkg)

            return {
                status: StatusCodes.OK,
                message: "Cập nhật thành công",
                success: true,
                data: pkg
            }

        } catch (error) {
            logger.error(error?.message)
            console.log(`Error in PackageSerivce - method updatePackage() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi cập nhật gói, vui lòng thử lại sau",
            }
        }
    }
    async deletePackage(packageId: number): Promise<IResponseBase> {
        try {

            if (!packageId) {
                return {
                    status: StatusCodes.BAD_REQUEST,
                    message: "Vui lòng kiểm tra lại dữ liệu của bạn",
                    success: false
                }
            }
            const pkg = await this._context.PackageRepo.findOne({
                where: { id: packageId }
            })
            if (!pkg) {
                return {
                    status: StatusCodes.NOT_FOUND,
                    message: "Không tìm thấy gói dịch vụ",
                    success: false
                }
            }

            await this._context.PackageRepo.remove(pkg)

            return {
                status: StatusCodes.OK,
                message: "Xóa gói thành công",
                success: true,
            }

        } catch (error) {
            logger.error(error?.message)
            console.log(`Error in PackageSerivce - method deletePackage() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi xóa gói, vui lòng thử lại sau",
            }
        }
    }

}