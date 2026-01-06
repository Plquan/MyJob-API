import IExperienceService from "@/interfaces/experience/experience-interface"
import { before, DELETE, GET, inject, POST, PUT, route } from "awilix-express"
import { Request, Response } from "express"
import { Auth } from "@/common/middlewares"
@before(inject(Auth.required))
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
        res.status(200).json(response)
    }

    @POST()
    @route("/create-experience")
    async createExperience(req: Request, res: Response){
        const data = req.body
        const response = await this._experienceService.createExperience(data)
        res.status(200).json(response)
    }

    @PUT()
    @route("/update-experience")
    async updateExperience(req: Request, res: Response){
        const data = req.body
        const response = await this._experienceService.updateExperience(data)
        res.status(200).json(response)
    }

    @DELETE()
    @route("/delete-experience/:experienceId")
    async deleteExperience(req: Request, res: Response){
        const experienceId = parseInt(req.params.experienceId);
        const response = await this._experienceService.deleteExperience(experienceId)
        res.status(200).json(response)
    }
}