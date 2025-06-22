import IResumeService from "@/interfaces/resume/IResumeService";
import { asyncLocalStorageMiddleware } from "@/middlewares";
import AuthenticateMiddleware from "@/middlewares/AuthenticateMiddleware";
import { uploadAvatarMiddleware } from "@/middlewares/uploadMiddleware";
import { GET, route, PUT, before, inject, POST } from "awilix-express";
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
        const {
            title, position, academicLevel, experience,
            careerId, provinceId, salaryMin, salaryMax,
            typeOfWorkPlace, jobType, description,
        } = req.body
          const file = req.file
          const data = {
            title,
            position: Number(position),
            academicLevel: Number(academicLevel),
            experience: Number(experience),
            careerId: Number(careerId),
            provinceId: Number(provinceId),
            salaryMin: Number(salaryMin),
            salaryMax: Number(salaryMax),
            typeOfWorkPlace: Number(typeOfWorkPlace),
            jobType: Number(jobType),
            description,
        }
        const response = await this._resumeService.uploadAttachedResume(data,file)
        return res.status(response.status).json(response)
    }

    @GET()
    @route("/get-attached-resumes")
    async getAllAttachedResumes (req: Request, res: Response){
        const response = await this._resumeService.getAllAttachedResumes()
        return res.status(response.status).json(response)
    }

}