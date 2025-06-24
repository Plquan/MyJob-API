
import IEducationService from "@/interfaces/education/IEducationService"
import AuthenticateMiddleware from "@/middlewares/AuthenticateMiddleware"
import { before, DELETE, GET, inject, POST, PUT, route } from "awilix-express"
import { Request, Response } from "express"

@before(inject((JwtService) => AuthenticateMiddleware(JwtService)))
@route("/education")
export class EducationController {

    private readonly _educationService: IEducationService
    
    constructor(EducationService: IEducationService){
        this._educationService = EducationService
    }

    @GET()
    @route("/get-educations")
    async getAllEducations(req: Request, res: Response){
        const response = await this._educationService.getAllEducations()
        res.status(response.status).json(response)
    }

    @POST()
    @route("/create-education")
    async createEducation(req: Request, res: Response){
        const data = req.body
        const response = await this._educationService.createEducation(data)
        res.status(response.status).json(response)
    }

    @PUT()
    @route("/update-education")
    async updateEducation(req: Request, res: Response){
        const data = req.body
        const response = await this._educationService.updateEducation(data)
        res.status(response.status).json(response)
    }

    @DELETE()
    @route("/delete-education/:educationId")
    async deleteEducation(req: Request, res: Response){
        const educationId = parseInt(req.params.educationId);
        const response = await this._educationService.deleteEducation(educationId)
        res.status(response.status).json(response)
    }
}