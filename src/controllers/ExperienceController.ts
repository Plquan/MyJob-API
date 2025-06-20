import IExperienceService from "@/interfaces/experience/IExperienceService"
import AuthenticateMiddleware from "@/middlewares/AuthenticateMiddleware"
import { before, DELETE, GET, inject, POST, PUT, route } from "awilix-express"
import { Request, Response } from "express"

@before(inject((JwtService) => AuthenticateMiddleware(JwtService)))
@route("/experience")
export class ExperienceController {

    private readonly _experienceService: IExperienceService
    
    constructor(ExperienceService: IExperienceService){
        this._experienceService = ExperienceService
    }

    @GET()
    @route("/get-experiences")
    async getAllExperiences(req: Request, res: Response){
        const response = await this._experienceService.getAllExperiences()
        res.status(response.status).json(response)
    }

    @POST()
    @route("/create-experience")
    async createExperience(req: Request, res: Response){
        const data = req.body
        const response = await this._experienceService.createExperience(data)
        res.status(response.status).json(response)
    }

    @PUT()
    @route("/update-experience")
    async updateExperience(req: Request, res: Response){
        const data = req.body
        const response = await this._experienceService.updateExperience(data)
        res.status(response.status).json(response)
    }

    @DELETE()
    @route("/delete-experience/:experienceId")
    async deleteExperience(req: Request, res: Response){
        const experienceId = parseInt(req.params.experienceId);
        const response = await this._experienceService.deleteExperience(experienceId)
        res.status(response.status).json(response)
    }
}