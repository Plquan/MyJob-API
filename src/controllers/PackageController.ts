import IPackageService from "@/interfaces/package/IPackageService";
import { route, GET, POST, PUT, DELETE } from "awilix-express";
import { Request, Response } from "express";

@route('/package')
export class PackageController {

    private readonly _packageService: IPackageService

    constructor(PackageService: IPackageService){
        this._packageService = PackageService
    }

    @GET()
    @route('/get-packages')
    async getAllPackages(req: Request, res: Response){
        const response = await this._packageService.getAllPackages()
        res.status(response.status).json(response)
    }

    @GET()
    @route('/get-features')
    async getAllFeatures(req: Request, res: Response){
        const response = await this._packageService.getAllFeatures()
        res.status(response.status).json(response)
    }

    @POST()
    @route('/create-package')
    async createPackage(req: Request, res: Response){
        const data = req.body
        const response = await this._packageService.createPackage(data)
        res.status(response.status).json(response)
    }

    @PUT()
    @route('/update-package')
    async updatePackage(req: Request, res: Response){
        const data = req.body
        const response = await this._packageService.updatePackage(data)
        res.status(response.status).json(response)
    }

    @DELETE()
    @route('/delete-package/:packageId')
    async deletePackage(req: Request, res: Response){
        const packageId = parseInt(req.params.packageId)
        const response = await this._packageService.deletePackage(packageId)
        res.status(response.status).json(response)
    }

    @GET()
    @route('/get-package-types')
    async getAllPackageTypes(req: Request, res: Response){
        const response = await this._packageService.getAllPackageTypes()
        res.status(response.status).json(response)
    }

    @GET()
    @route('/get-features-of-package/:packageId')
    async getFeaturesOfPackage(req: Request, res: Response){
        const packageId = parseInt(req.params.packageId);
        const response = await this._packageService.getFeaturesOfPackage(packageId)
        res.status(response.status).json(response)
    }

    @PUT()
    @route('/update-package-features/:packageId')
    async updatePackageFeatures(req: Request, res: Response){
        const data = req.body
        const packageId = parseInt(req.params.packageId);
        const response = await this._packageService.updatePackageFeature(data,packageId)
        res.status(response.status).json(response)
    }
}