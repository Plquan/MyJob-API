import IResumeService from "@/interfaces/resume/IResumeService";
import { IUpdateAttachedResumeData } from "@/interfaces/resume/ResumeDto";
import { asyncLocalStorageMiddleware } from "@/middlewares";
import AuthenticateMiddleware from "@/middlewares/AuthenticateMiddleware";
import { uploadAvatarMiddleware } from "@/middlewares/uploadMiddleware";
import { GET, route, PUT, before, inject, POST, DELETE } from "awilix-express";
import { Request, Response } from "express";

@before(inject((JwtService) => AuthenticateMiddleware(JwtService)))
@route("/resume")
export class ResumeController {
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
    
    @before([
    uploadAvatarMiddleware,
    asyncLocalStorageMiddleware()])
    @POST()
    @route("/upload-attached-resume")
    async uploadAttachedResume(req:Request, res: Response){
        const file = req.file
        const data = JSON.parse(req.body.data)
        const response = await this._resumeService.uploadAttachedResume(data,file)
        return res.status(response.status).json(response)
    }
    
    @before([
    uploadAvatarMiddleware,
    asyncLocalStorageMiddleware()])
    @PUT()
    @route("/update-attached-resume")
    async updateAttachedResume (req: Request, res: Response){
        const file = req.file
        console.log(req.body.data)
        const data = JSON.parse(req.body.data)
        const response = await this._resumeService.updateAttachedResume(data,file)
        return res.status(response.status).json(response)
    }

    @GET()
    @route("/get-attached-resumes")
    async getAllAttachedResumes (req: Request, res: Response){
        const response = await this._resumeService.getAllAttachedResumes()
        return res.status(response.status).json(response)
    }

    @DELETE()
    @route("/delete-attached-resume/:attachedResumeId")
    async deleteAttachedResume (req: Request, res: Response){
        const attachedResumeId = parseInt(req.params.attachedResumeId)
        const response = await this._resumeService.deleteAttachedResume(attachedResumeId)
        return res.status(response.status).json(response)
    }
}