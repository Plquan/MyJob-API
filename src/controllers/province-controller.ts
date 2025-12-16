import IProvinceService from "@/interfaces/province/province-interface";
import { GET, route } from "awilix-express";
import { Request, Response } from "express";
@route("/province")
export class ProvinceController {
  private readonly _provinceService: IProvinceService

  constructor(ProvinceService: IProvinceService) {
    this._provinceService = ProvinceService
  }

  @GET()
  async getAllProvinces(req: Request, res: Response) {
    try {
      const response = await this._provinceService.getAllProvinces();
      return res.status(200).json(response);
    }
    catch (error) {
      throw error
    }
  }

}