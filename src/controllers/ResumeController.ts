import IResumeService from "@/interfaces/resume/IResumeService";
import AuthenticateMiddleware from "@/middlewares/AuthenticateMiddleware";
import { GET, route, PUT, before, inject } from "awilix-express";
import { Request, Response } from "express";

@before(inject((JwtService) => AuthenticateMiddleware(JwtService)))
@route("/resume")
export default class ResumeController {
    private readonly _resumeService: IResumeService

    constructor(ResumeService:IResumeService){
        this._resumeService = ResumeService
    }

    @GET()
    @route("/get-online-resume")
    
    async getCandidateOnlineResume (req: Request, res: Response){
        const response = await this._resumeService.getOnlineResume()
        return res.status(response.status).json(response)
    }

    @PUT()
    @route("/update-online-resume")
    async updateOnlineResume(req:Request, res: Response){
        const data = req.body
        const response = await this._resumeService.updateOnlineResume(data)
        return res.status(response.status).json(response)
    }
}