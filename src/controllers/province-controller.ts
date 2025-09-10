import { ErrorMessages } from "@/common/constants/ErrorMessages";
import { HttpException } from "@/errors/http-exception";
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

  @GET()
  @route("/get-districts/:provinceId")
  async getDistrictsByProvince(req: Request, res: Response) {
    try {
      const provinceId = parseInt(req.params.provinceId);
      if (!provinceId) {
        throw new HttpException(400, ErrorMessages.INVALID_REQUEST_BODY)
      }
      const response = await this._provinceService.getDistrictsByProvince(provinceId);
      return res.status(200).json(response);
    } catch (error) {
      throw error
    }

  }

}