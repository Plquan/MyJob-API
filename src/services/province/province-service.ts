import { IResponseBase } from "@/interfaces/base/IResponseBase"
import IProvinceService from "@/interfaces/province/province-interface"
import DatabaseService from "../common/database-service"
import { StatusCodes } from "http-status-codes"
import { Province } from "@/entities/province"
import { District } from "@/entities/district"

export default class ProvinceService implements IProvinceService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
    }
    async getDistrictsByProvince(provinceId: number): Promise<District[]> {
        const districts = await this._context.DistrictRepo.find({
            where: { provinceId }
        })
        return districts

    }

    async getAllProvinces(): Promise<Province[]> {
        const provinces = await this._context.ProvinceRepo.find()
        return provinces
    }
}