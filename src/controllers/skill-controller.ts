import ISkillService from "@/interfaces/skill/skill-interface"
import { before, DELETE, GET, inject, POST, PUT, route } from "awilix-express"
import { Request, Response } from "express"
import { Auth } from "@/common/middlewares"

@before(inject(Auth.required))
@route("/skill")
export class SkillController {

    private readonly _skillService: ISkillService
    
    constructor(SkillService: ISkillService){
        this._skillService = SkillService
    }

    @GET()
    @route("/get-skills")
    async getAllSkills(req: Request, res: Response){
        const response = await this._skillService.getAllSkills()
        res.status(200).json(response)
    }

    @POST()
    @route("/create-skill")
    async createSkill(req: Request, res: Response){
        const data = req.body
        const response = await this._skillService.createSkill(data)
        res.status(201).json(response)
    }

    @PUT()
    @route("/update-skill")
    async updateSkill(req: Request, res: Response){
        const data = req.body
        const response = await this._skillService.updateSkill(data)
        res.status(200).json(response)
    }

    @DELETE()
    @route("/delete-skill/:skillId")
    async deleteSkill(req: Request, res: Response){
        const skillId = parseInt(req.params.skillId);
        const response = await this._skillService.deleteSkill(skillId)
        res.status(204).json(response)
    }
}