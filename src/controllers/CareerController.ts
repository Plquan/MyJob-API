import ICareerService from "@/interfaces/career/ICareerService";
import { GET, route } from "awilix-express";
import { Request, Response } from "express";

@route("/career")
export class CareerController {
    
    private readonly _careerService:ICareerService

    constructor(CareerService:ICareerService){
        this._careerService = CareerService
    }

    @GET() 
    @route("/get-careers")
    async getAllCareers(req: Request, res:Response){
        const response = await this._careerService.getAllCareers()
        res.status(response.status).json(response)
    }

}