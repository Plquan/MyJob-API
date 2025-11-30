import IProvinceService from "@/interfaces/province/province-interface"
import DatabaseService from "../common/database-service"
import { Province } from "@/entities/province"

export default class ProvinceService implements IProvinceService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
    }

    async getAllProvinces(): Promise<Province[]> {
        const provinces = await this._context.ProvinceRepo.find()
        return provinces
    }
}