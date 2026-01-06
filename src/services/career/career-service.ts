import ICareerService from "@/interfaces/career/career-interface";
import DatabaseService from "../common/database-service";
import logger from "@/common/helpers/logger";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { ICareerData } from "@/dtos/career/carreer-dto";


export default class CareerService implements ICareerService {

  private readonly _context: DatabaseService

  constructor(DatabaseService: DatabaseService) {
    this._context = DatabaseService
  }

  async getAllCareers(): Promise<ICareerData[]> {
    try {
      const careers = await this._context.CareerRepo.find()
      return careers
    } catch (error) {
      throw error
    }
  }

}