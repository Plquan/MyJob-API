import { IResponseBase } from "@/interfaces/base/IResponseBase";
import IProvinceService from "@/interfaces/province/IProvinceService";
import { IProvinceData } from "@/interfaces/province/ProvinceDto";
import DatabaseService from "../database/DatabaseService";
import { StatusCodes } from "http-status-codes";
import logger from "@/helpers/logger";
import { ErrorMessages } from "@/constants/ErrorMessages";

export default class ProvinceService implements IProvinceService {
    private readonly _context:DatabaseService

     constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }

    async getAllProvinces(): Promise<IResponseBase> {
        try {
            const provinces = await this._context.ProvinceRepo.find({
            order: {
            createdAt: "DESC",
            },
        })
        return {
            status: StatusCodes.OK,
            success: true,
            message: "Get all Provinces successfully",
            data: provinces,
        }
        } catch (error) {
            logger.error(error?.message);
            console.log(`Error in ProvinceService - method getAllProvinces() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: ErrorMessages.INTERNAL_SERVER_ERROR,
                data: null,
                error: {
                message: ErrorMessages.INTERNAL_SERVER_ERROR,
                errorDetail: error.message,
            },
            };
        }
    }
    
}