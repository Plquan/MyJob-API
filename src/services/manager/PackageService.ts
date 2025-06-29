import logger from "@/helpers/logger";
import { IResponseBase } from "@/interfaces/base/IResponseBase";
import IPackageService from "@/interfaces/package/IPackageService";
import { StatusCodes } from "http-status-codes";
import DatabaseService from "@services/common/DatabaseService";
import { ICreatePackageData, IPackageFeatureData, IUpdatePackageData } from "@/interfaces/package/PackageDto";

export default class PackageService implements IPackageService {

    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }
    async updatePackageFeature(data: IPackageFeatureData[],packageId: number): Promise<IResponseBase> {
        try {
            if(!packageId){
                 return {
                    status: StatusCodes.BAD_REQUEST,
                    message: "Vui lòng kiểm tra lại dữ liệu của bạn",
                    success: false,
                }
            }

            await this._context.PackageFeatureRepo.delete({packageId})
            if(data.length > 0){
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
    async getFeaturesOfPackage(packageId: number): Promise<IResponseBase> {
        try {
            if(!packageId){
                return {
                    status: StatusCodes.BAD_REQUEST,
                    message: "Vui lòng kiểm tra lại dữ liệu của bạn",
                    success: false,
                }
            }

             const packageWithDetails = await this._context.PackageRepo.findOne({
                where: { id: packageId },
                relations: [
                'packageType',
                'packageType.features',
                'packageFeatures',
                ]
            })

            const result = packageWithDetails.packageType.features.map((feature) => {
                const packageFeature = packageWithDetails.packageFeatures.find(
                (pf) => pf.featureId === feature.id)
                return {
                    featureId: feature.id,
                    packageId: packageId,
                    open: !!packageFeature,
                    name: feature.name,
                    limit: packageFeature?.limit,
                    description: packageFeature?.description,
                }
            })
         
           return{  
                status: StatusCodes.OK,
                message: "Lấy danh sách tính năng thuộc gói thành công",
                success: true,
                data: result          
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
    async getAllPackageTypes(): Promise<IResponseBase> {
        try {
            const packageTypes = await this._context.PackageTypeRepo.find()

            return {
                status: StatusCodes.OK,
                message: "Lấy danh sách thành công",
                success: true,
                data: packageTypes
            }
            
        } catch (error) {
            logger.error(error?.message)
            console.log(`Error in PackageSerivce - method getAllPackageTypes() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi lấy danh sách loại gói, vui lòng thử lại sau",
            }
        }
    }
    async getAllFeatures(): Promise<IResponseBase> {
        try {
            const features = await this._context.FeatureRepo.find()
            return {
                status: StatusCodes.OK,
                message: "Lấy danh sách thành công",
                success: true,
                data: features
            }    
        } catch (error) {
             logger.error(error?.message)
            console.log(`Error in PackageSerivce - method getAllFeatures() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi lấy danh sách tính năng, vui lòng thử lại sau",
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
            if(!data.name || !data.packageTypeId){
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
                success:true,
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
            if(!data.id || !data.name){
                 return {
                    status: StatusCodes.BAD_REQUEST,
                    message: "Vui lòng kiểm tra lại dữ liệu của bạn",
                    success: false
                }
            }
            const pkg = await this._context.PackageRepo.findOne({
                where:{id:data.id}
            })
            if(!pkg){
              return {
                status: StatusCodes.NOT_FOUND,
                message: "Không tìm thấy gói dịch vụ",
                success:false
             }
            }
            this._context.PackageRepo.merge(pkg,data)
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

             if(!packageId){
                 return {
                    status: StatusCodes.BAD_REQUEST,
                    message: "Vui lòng kiểm tra lại dữ liệu của bạn",
                    success: false
                }
            }
            const pkg = await this._context.PackageRepo.findOne({
                where:{id:packageId}
            })
            if(!pkg){
              return {
                status: StatusCodes.NOT_FOUND,
                message: "Không tìm thấy gói dịch vụ",
                success:false
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