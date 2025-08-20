import IProvinceService from "@/interfaces/province/province-interface";
import { GET, route } from "awilix-express";
import { Request,Response } from "express";
@route("/province")
export class ProvinceController {
    private readonly _provinceService:IProvinceService

    constructor(ProvinceService:IProvinceService){
        this._provinceService = ProvinceService
    }

    @GET()
    @route("/get-provinces")
    async getAllProvinces(req: Request, res: Response) {
    const response = await this._provinceService.getAllProvinces();
    return res.status(response.status).json(response); }

    @GET()
    @route("/get-districts/:provinceId")
    async getDistrictsByProvince(req: Request, res: Response) {
    const provinceId = parseInt(req.params.provinceId);
    const response = await this._provinceService.getDistrictsByProvince(provinceId);
    return res.status(response.status).json(response);
  }

}