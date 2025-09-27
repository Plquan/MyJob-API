import { ErrorMessages } from "@/common/constants/ErrorMessages"
import { getCurrentUser } from "@/common/helpers/get-current-user"
import { asyncLocalStorageMiddleware } from "@/common/middlewares"
import AuthenticateMiddleware from "@/common/middlewares/authenticate-middleware"
import { uploadFileMiddleware, uploadMultiFileMiddleware } from "@/common/middlewares/upload-middleware"
import { HttpException } from "@/errors/http-exception"
import ICompanyService from "@/interfaces/company/company-interface"
import { before, DELETE, GET, inject, POST, PUT, route } from "awilix-express"
import { Request, Response } from "express"

@route("/company")
export class CompanyController {
    private readonly _companyService: ICompanyService

    constructor(CompanyService: ICompanyService) {
        this._companyService = CompanyService
    }

    @before([
        inject((JwtService) => AuthenticateMiddleware(JwtService)),
        uploadMultiFileMiddleware,
        asyncLocalStorageMiddleware()])
    @POST()
    @route("/upload-company-images")
    async uploadCompanyMedias(req: Request, res: Response) {
        const files = req.files as Express.Multer.File[];
        const response = await this._companyService.uploadCompanyImages(files);
        res.status(201).json(response)
    }

    @before(inject((JwtService) => AuthenticateMiddleware(JwtService)))
    @DELETE()
    @route("/delete-company-image/:imageId")
    async deleteCompanyMedias(req: Request, res: Response) {
        const imageId = parseInt(req.params.imageId);
        const response = await this._companyService.deleteCompanyImage(imageId)
        res.status(200).json(response)
    }

    @before(inject((JwtService) => AuthenticateMiddleware(JwtService)))
    @GET()
    @route("/get-employer-company")
    async getEmployerCompany(req: Request, res: Response) {
        const companyId = getCurrentUser().companyId
        const response = await this._companyService.getCompanyById(companyId);
        res.status(200).json(response)
    }

    @before([
        inject((JwtService) => AuthenticateMiddleware(JwtService)),
        uploadFileMiddleware,
        asyncLocalStorageMiddleware()])
    @PUT()
    @route("/upload-company-cover-image")
    async uploadCompanyCoverImage(req: Request, res: Response) {
        const file = req.file
        const response = await this._companyService.uploadCompanyCoverImage(file)
        res.status(200).json(response)
    }

    @before([
        inject((JwtService) => AuthenticateMiddleware(JwtService)),
        uploadFileMiddleware,
        asyncLocalStorageMiddleware()])
    @PUT()
    @route("/upload-company-logo")
    async uploadCompanyLogo(req: Request, res: Response) {
        const file = req.file
        const response = await this._companyService.uploadCompanyLogo(file)
        res.status(200).json(response)
    }
    @GET()
    async getCompanies(req: Request, res: Response) {
        const response = await this._companyService.getCompanies()
        res.status(200).json(response)
    }


}