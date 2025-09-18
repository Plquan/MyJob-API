import { CompanyDto } from "@/dtos/company/company-dto";
import { IResponseBase } from "../base/IResponseBase";
import { ICompanyData } from "../../dtos/company/CompanyDto";
import { MyJobFileDto } from "@/dtos/myjob-file/myjob-file-dto";
import { IMyJobFileDto } from "../myjobfile/myjobfile-dto";

export default interface ICompanyService {
    createCompanyInfo(data: ICompanyData): Promise<IResponseBase>
    getCompanies(): Promise<CompanyDto[]>
    getCompanyById(companyId: number): Promise<CompanyDto>
    uploadCompanyLogo(image: Express.Multer.File): Promise<IMyJobFileDto>
    uploadCompanyCoverImage(image: Express.Multer.File): Promise<IMyJobFileDto>
    uploadCompanyImages(images: Express.Multer.File[]): Promise<MyJobFileDto[]>
    deleteCompanyImages(fileIds: number[]): Promise<number[]>
}