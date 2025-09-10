import { CompanyDto } from "@/dtos/company/company-dto";
import { IResponseBase } from "../base/IResponseBase";
import { ICompanyData } from "../../dtos/company/CompanyDto";
export default interface ICompanyService {
    createCompanyInfo(data: ICompanyData): Promise<IResponseBase>
    getCompanies(): Promise<CompanyDto[]>
    getCompanyById(companyId: number): Promise<CompanyDto>
}