import { Auth } from "@/common/middlewares";
import IPackageService from "@/interfaces/package/package-interface";
import { route, GET, POST, PUT, DELETE, before, inject } from "awilix-express";
import { Request, Response } from "express";

@route('/package')
export class PackageController {

    private readonly _packageService: IPackageService

    constructor(PackageService: IPackageService) {
        this._packageService = PackageService
    }
    @before(inject(Auth.required))
    @GET()
    @route('/get-all-package')
    async getAllPackages(req: Request, res: Response) {
        const response = await this._packageService.getAllPackages()
        res.status(200).json(response)
    }
    @before(inject(Auth.required))
    @POST()
    async createPackage(req: Request, res: Response) {
        const data = req.body
        const response = await this._packageService.createPackage(data)
        res.status(201).json(response)
    }
    @before(inject(Auth.required))
    @PUT()
    async updatePackage(req: Request, res: Response) {
        const data = req.body
        const response = await this._packageService.updatePackage(data)
        res.status(200).json(response)
    }
    @before(inject(Auth.required))
    @DELETE()
    async deletePackage(req: Request, res: Response) {
        const packageId = Number(req.query.packageId)
        const response = await this._packageService.deletePackage(packageId)
        res.status(204).json(response)
    }
    @GET()
    async getPackages(req: Request, res: Response) {
        const response = await this._packageService.getPackages()
        res.status(200).json(response)
    }
}