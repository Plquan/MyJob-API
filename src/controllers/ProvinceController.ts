import IProvinceService from "@/interfaces/province/IProvinceService";
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
    const provinces = await this._provinceService.getAllProvinces();
    return res.status(provinces.status).json(provinces);
  }

}