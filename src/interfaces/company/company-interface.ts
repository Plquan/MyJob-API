import { CompanyDto } from "@/dtos/company/company-dto";
import { IResponseBase } from "../base/IResponseBase";
import { ICompanyData } from "../../dtos/company/CompanyDto";
import { MyJobFileDto } from "@/dtos/myjob-file/myjob-file-dto";
import { IMyJobFileDto } from "../myjobfile/myjobfile-dto";
import { ICompanyDto, ICompanyWithImagesDto, IUpdateCompanyRequest } from "./company-dto";

export default interface ICompanyService {
    createCompanyInfo(data: ICompanyData): Promise<IResponseBase>
    getCompanies(): Promise<ICompanyWithImagesDto[]>
    getCompanyById(companyId: number): Promise<ICompanyWithImagesDto>
    uploadCompanyLogo(image: Express.Multer.File): Promise<IMyJobFileDto>
    uploadCompanyCoverImage(image: Express.Multer.File): Promise<IMyJobFileDto>
    uploadCompanyImages(images: Express.Multer.File[]): Promise<MyJobFileDto[]>
    deleteCompanyImage(imageId: number): Promise<boolean>
    updateCompanyInfo(request: IUpdateCompanyRequest): Promise<ICompanyDto>
}