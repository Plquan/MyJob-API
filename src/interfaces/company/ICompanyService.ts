import { IResponseBase } from "../base/IResponseBase";
import { ICompanyData } from "./CompanyDto";
export default interface ICompanyService {
    createCompanyInfo(data: ICompanyData): Promise<IResponseBase>
}