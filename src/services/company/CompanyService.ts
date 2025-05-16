import { IResponseBase } from "@/interfaces/base/IResponseBase";
import { ICompanyData } from "@/interfaces/company/CompanyDto";
import ICompanyService from "@/interfaces/company/ICompanyService";
import DatabaseService from "../database/DatabaseService";
import { StatusCodes } from "http-status-codes";
import slugify from "slugify";
import logger from "@/helpers/logger";
import { ErrorMessages } from "@/constants/ErrorMessages";

export default class CompanyService implements ICompanyService{

    private readonly _context:DatabaseService

    constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }

    async generateCompanySlug(companyName: string): Promise<string> {
        let slug = slugify(companyName, {
            lower: true,   
            strict: true,  
            locale: 'vi' 
        });

            let isUnique = await this._context.CompanyRepo.findOne({
                where: { slug: slug } 
            });

        let count = 1;
        while (isUnique) {
            const newSlug = `${slug}-${count}`;
            isUnique = await await this._context.CompanyRepo.findOne({
                where: { slug: newSlug } 
            });
            if (!isUnique) {
                slug = newSlug;
            }
            count++;
        }

        return slug;
    }

    async createCompanyInfo(data: ICompanyData): Promise<IResponseBase> {
        console.log('data',data)
        try {
            if(!data.companyName || !data.companyEmail || !data.companyPhone || !data.fieldOperation || !data.provinceId
                ||!data.since || !data.taxCode || !data.address || !data.fieldOperation
              ) {
                return {
                    status:StatusCodes.BAD_REQUEST,
                    success:false,
                    message:"Missing required fields",
                    data:null,
                    error: {
                        message: "Missing required fields",
                        errorDetail:"Missing required fields"
                    }
                }
            }
            data.slug = await this.generateCompanySlug(data.companyName)
            const companyInfo = await this._context.CompanyRepo.create(data)
            await this._context.CompanyRepo.save(companyInfo);

             return {
                    status:StatusCodes.CREATED,
                    success:true,
                    message:"Create company profile success",
                    data:null,
             }

        } catch (error) {
         logger.error(error?.message);
            console.log(
                `Error in CategoryService - method createNewCategory at ${new Date().getTime()} with message ${error?.message}`
            );
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
