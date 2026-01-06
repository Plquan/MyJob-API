import { ICompanyData } from "../../dtos/company/CompanyDto";
import { MyJobFileDto } from "@/dtos/myjob-file/myjob-file-dto";
import { IMyJobFileDto } from "../myjobfile/myjobfile-dto";
import { ICompanyDetail, ICompanyDto, ICompanyWithImagesDto, IUpdateCompanyRequest, IGetCompaniesReqParams, ICompanyStatistics, IGetEmployerStatisticsRequest } from "./company-dto";
import { IPaginationResponse } from "../base/IPaginationBase";

export default interface ICompanyService {
    createCompanyInfo(data: ICompanyData): Promise<ICompanyDto>
    getCompanies(params: IGetCompaniesReqParams): Promise<IPaginationResponse<ICompanyWithImagesDto>>
    getCompanyById(companyId: number): Promise<ICompanyWithImagesDto>
    uploadCompanyLogo(image: Express.Multer.File): Promise<IMyJobFileDto>
    uploadCompanyCoverImage(image: Express.Multer.File): Promise<IMyJobFileDto>
    uploadCompanyImages(images: Express.Multer.File[]): Promise<MyJobFileDto[]>
    deleteCompanyImage(imageId: number): Promise<boolean>
    updateCompanyInfo(request: IUpdateCompanyRequest): Promise<ICompanyDto>
    getCompanyDetail(companyId: number):Promise<ICompanyDetail>
    toggleFollowCompany(companyId: number): Promise<boolean>
    getSavedCompanies(): Promise<ICompanyWithImagesDto[]>
    getEmployerStatistics(params?: IGetEmployerStatisticsRequest): Promise<ICompanyStatistics>
}