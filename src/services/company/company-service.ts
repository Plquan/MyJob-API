import { IResponseBase } from "@/interfaces/base/IResponseBase";
import { ICompanyData } from "@/dtos/company/CompanyDto";
import ICompanyService from "@/interfaces/company/company-interface";
import DatabaseService from "../common/database-service";
import { StatusCodes } from "http-status-codes";
import logger from "@/common/helpers/logger";
import { ErrorMessages } from "@/common/constants/ErrorMessages";
import { CompanyDto } from "@/dtos/company/company-dto";

export default class CompanyService implements ICompanyService{

    private readonly _context:DatabaseService

    constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }
    getCompanies(): Promise<CompanyDto[]> {
        throw new Error("Method not implemented.");
    }
    
    async createCompanyInfo(data: ICompanyData): Promise<IResponseBase> {
        try {
            if(!data.companyName || !data.companyEmail || !data.companyPhone || !data.fieldOperation || !data.provinceId
                ||!data.since || !data.taxCode || !data.address || !data.fieldOperation) {
                return {
                    status:StatusCodes.BAD_REQUEST,
                    success:false,
                    message:"Missing required fields"
                }
            }

            const companyInfo = await this._context.CompanyRepo.create(data)
            await this._context.CompanyRepo.save(companyInfo)

             return {
                status:StatusCodes.CREATED,
                success:true,
                message:"Create company profile success"
             }

        } catch (error) {
            logger.error(error?.message);
            console.log(
                `Error in CompanyService - method createCompanyInfo at ${new Date().getTime()} with message ${error?.message}`
            )
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: ErrorMessages.INTERNAL_SERVER_ERROR
            }
        }
    } 
}
