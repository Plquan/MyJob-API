import { IResponseBase } from "@/interfaces/base/IResponseBase";
import ICareerService from "@/interfaces/career/ICareerService";
import DatabaseService from "../common/DatabaseService";
import logger from "@/helpers/logger";
import { StatusCodes } from "http-status-codes";


export default class CareerService implements ICareerService {

    private readonly _context : DatabaseService

    constructor(DatabaseService:DatabaseService){
        this._context = DatabaseService
    }

    async getAllCareers(): Promise<IResponseBase> {
       try {
         const careers = await this._context.CareerRepo.find()
         return {
            status:StatusCodes.OK,
            success:true,
            message:"Lấy danh sách ngành nghề thành công",
            data:careers
         }
       } catch (error) {
        logger.error(error?.message);
          console.error(
            `Error in CareerService - method getAllCareer at ${new Date().toISOString()} with message: ${error?.message}`
          )
          return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Lỗi lấy hồ sơ cá nhân, vui lòng thử lại sau",
          }
       }
    }
    
}