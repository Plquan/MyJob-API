import { IResponseBase } from "@/interfaces/base/IResponseBase";
import { ICompanyData } from "@/dtos/company/CompanyDto";
import ICompanyService from "@/interfaces/company/company-interface";
import DatabaseService from "../common/database-service";
import { StatusCodes } from "http-status-codes";
import logger from "@/common/helpers/logger";
import { CompanyDto } from "@/dtos/company/company-dto";
import { HttpException } from "@/errors/http-exception";
import { ErrorMessages } from "@/common/constants/ErrorMessages";
import { plainToInstance } from "class-transformer";


export default class CompanyService implements ICompanyService {

    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
    }
    async getCompanyById(companyId: number): Promise<CompanyDto> {
        const company = await this._context.CompanyRepo
            .createQueryBuilder('company')
            .leftJoinAndSelect('company.files', 'companyFile')
            .leftJoinAndSelect('companyFile.images', 'myJobFile')
            .where('company.id = :id', { id: companyId })
            .getOne();

        if (company == null) {
            throw new HttpException(StatusCodes.NOT_FOUND, ErrorMessages.NOT_FOUND)
        }

        const result = plainToInstance(CompanyDto, {
            ...company,
            images: company.files?.map(file => file.images) || []
        });
        return result;
    }
    
    async getCompanies(): Promise<CompanyDto[]> {
        const companies = await this._context.CompanyRepo
            .createQueryBuilder('company')
            .leftJoinAndSelect('company.files', 'companyFile')
            .leftJoinAndSelect('companyFile.images', 'myJobFile')
            .getMany();

        const result = companies.map(company => ({
            ...company,
            images: company.files?.map(file => file.images) || []
        }));
        return result;
    }

    async createCompanyInfo(data: ICompanyData): Promise<IResponseBase> {
        try {
            const companyInfo = await this._context.CompanyRepo.create(data)
            await this._context.CompanyRepo.save(companyInfo)

            return {
                status: StatusCodes.CREATED,
                success: true,
                message: "Create company profile success"
            }

        } catch (error) {
            logger.error(error?.message);
            console.log(
                `Error in CompanyService - method createCompanyInfo at ${new Date().getTime()} with message ${error?.message}`
            )
        }
    }

}
