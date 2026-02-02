import { getCurrentUser } from "@/common/helpers/get-current-user"
import { asyncLocalStorageMiddleware, Auth } from "@/common/middlewares"
import { uploadFileMiddleware, uploadMultiFileMiddleware } from "@/common/middlewares/upload-middleware"
import ICompanyService from "@/interfaces/company/company-interface"
import { IGetCompaniesReqParams } from "@/interfaces/company/company-dto"
import { before, DELETE, GET, inject, POST, PUT, route } from "awilix-express"
import { Request, Response } from "express"

@route("/company")
export class CompanyController {
    private readonly _companyService: ICompanyService

    constructor(CompanyService: ICompanyService) {
        this._companyService = CompanyService
    }

    @before([
        inject(Auth.required),
        uploadMultiFileMiddleware,
        asyncLocalStorageMiddleware()])
    @POST()
    @route("/upload-company-images")
    async uploadCompanyMedias(req: Request, res: Response) {
        const files = req.files as Express.Multer.File[];
        const response = await this._companyService.uploadCompanyImages(files);
        res.status(201).json(response)
    }

    @before(inject(Auth.required))
    @DELETE()
    @route("/delete-company-image/:imageId")
    async deleteCompanyMedias(req: Request, res: Response) {
        const imageId = parseInt(req.params.imageId);
        const response = await this._companyService.deleteCompanyImage(imageId)
        res.status(200).json(response)
    }

    @before(inject(Auth.required))
    @GET()
    @route("/get-employer-company")
    async getEmployerCompany(req: Request, res: Response) {
        const companyId = getCurrentUser().companyId
        const response = await this._companyService.getCompanyById(companyId);
        res.status(200).json(response)
    }

    @before([
        inject(Auth.required),
        uploadFileMiddleware,
        asyncLocalStorageMiddleware()])
    @PUT()
    @route("/upload-company-cover-image")
    async uploadCompanyCoverImage(req: Request, res: Response) {
        const file = req.file
        const response = await this._companyService.uploadCompanyCoverImage(file)
        res.status(200).json(response)
    }

    @before([inject(Auth.required), uploadFileMiddleware,
    asyncLocalStorageMiddleware()])
    @PUT()
    @route("/upload-company-logo")
    async uploadCompanyLogo(req: Request, res: Response) {
        const file = req.file
        const response = await this._companyService.uploadCompanyLogo(file)
        res.status(200).json(response)
    }

    @before(inject(Auth.optional))
    @GET()
    async getCompanies(req: Request, res: Response) {
        const { page = 1, limit = 10, companyName, provinceId } = req.query;
        const params: IGetCompaniesReqParams = {
            page: +page,
            limit: +limit,
            companyName: companyName?.toString(),
            provinceId: provinceId ? +provinceId : undefined,
        };
        const response = await this._companyService.getCompanies(params)
        res.status(200).json(response)
    }

    @GET()
    @route("/get-company-detail/:companyId")
    async getCompanyDetail(req: Request, res: Response) {
        const companyId = parseInt(req.params.companyId);
        const response = await this._companyService.getCompanyDetail(companyId)
        res.status(200).json(response)
    }
    @before(inject(Auth.required))
    @POST()
    @route("/toggle-follow-company")
    async toggleFollowCompany(req: Request, res: Response) {
        const companyId = Number(req.query.companyId)
        const response = await this._companyService.toggleFollowCompany(companyId)
        res.status(200).json(response)
    }

    @before(inject(Auth.required))
    @GET()
    @route("/saved-companies")
    async getSavedCompanies(req: Request, res: Response) {
        const response = await this._companyService.getSavedCompanies()
        res.status(200).json(response)
    }

    @before(inject(Auth.required))
    @GET()
    @route("/employer-statistics")
    async getEmployerStatistics(req: Request, res: Response) {
        const { startDate, endDate } = req.query;
        const response = await this._companyService.getEmployerStatistics({
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined
        })
        res.status(200).json(response)
    }

    @before(inject(Auth.required))
    @PUT()
    @route("/update-company-info")
    async updateCompanyInfo(req: Request, res: Response) {
        const response = await this._companyService.updateCompanyInfo(req.body);
        res.status(200).json(response);
    }

    @before(inject(Auth.optional))
    @GET()
    @route("/featured")
    async getFeaturedCompanies(req: Request, res: Response) {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
        const response = await this._companyService.getFeaturedCompanies(limit);
        res.status(200).json(response);
    }

}