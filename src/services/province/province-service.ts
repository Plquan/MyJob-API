import { IResponseBase } from "@/interfaces/base/IResponseBase"
import IProvinceService from "@/interfaces/province/province-interface"
import DatabaseService from "../common/database-service"
import { StatusCodes } from "http-status-codes"
import logger from "@/common/helpers/logger"

export default class ProvinceService implements IProvinceService {
    private readonly _context:DatabaseService

     constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }
    async getDistrictsByProvince(provinceId: number): Promise<IResponseBase> {
        try {
            const districts = await this._context.DistrictRepo.find({
                where: {provinceId}
            })
            return {
            status: StatusCodes.OK,
            success: true,
            message: "Lấy danh sách quận huyện thành công",
            data: districts,
        }
        } catch (error) {
            
        }
    }

    async getAllProvinces(): Promise<IResponseBase> {     
        try {
        const provinces = await this._context.ProvinceRepo.find({ relations: ['districts'] })
        return {
            status: StatusCodes.OK,
            success: true,
            message: "Lấy danh sách tỉnh thành công",
            data: provinces,
        }
        } catch (error) {
            logger.error(error?.message);
            console.log(`Error in ProvinceService - method getAllProvinces() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi khi lấy danh sách tỉnh, vui lòng thử lại sau",
            }
        }
    }
    
}