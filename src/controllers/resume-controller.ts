import IResumeService from "@/interfaces/resume/resume-interface";
import { asyncLocalStorageMiddleware, Auth } from "@/common/middlewares";
import { GET, route, PUT, before, inject, POST, DELETE } from "awilix-express";
import { Request, Response } from "express";
import { uploadFileMiddleware } from "@/common/middlewares/upload-middleware";

@before(inject(Auth.required))
@route("/resume")
export class ResumeController {
    private readonly _resumeService: IResumeService

    constructor(ResumeService: IResumeService) {
        this._resumeService = ResumeService
    }

    @GET()
    @route("/get-online-resume")
    async getCandidateOnlineResume(req: Request, res: Response) {
        const response = await this._resumeService.getOnlineResume()
        return res.status(200).json(response)
    }

    @PUT()
    @route("/update-online-resume")
    async updateOnlineResume(req: Request, res: Response) {
        const data = req.body
        const response = await this._resumeService.updateOnlineResume(data)
        return res.status(response.status).json(response)
    }

    @before([
        uploadFileMiddleware,
        asyncLocalStorageMiddleware()])
    @POST()
    @route("/upload-attached-resume")
    async uploadAttachedResume(req: Request, res: Response) {
        const file = req.file
        const data = req.body
        const response = await this._resumeService.uploadAttachedResume(data, file)
        return res.status(response.status).json(response)
    }

    @before([
        uploadFileMiddleware,
        asyncLocalStorageMiddleware()])
    @PUT()
    @route("/update-attached-resume")
    async updateAttachedResume(req: Request, res: Response) {
        const file = req.file
        const data = req.body
        const response = await this._resumeService.updateAttachedResume(data, file)
        return res.status(response.status).json(response)
    }

    @GET()
    @route("/get-attached-resumes")
    async getAllAttachedResumes(req: Request, res: Response) {
        const response = await this._resumeService.getAllAttachedResumes()
        return res.status(response.status).json(response)
    }

    @DELETE()
    @route("/delete-attached-resume/:attachedResumeId")
    async deleteAttachedResume(req: Request, res: Response) {
        const attachedResumeId = parseInt(req.params.attachedResumeId)
        if (!attachedResumeId) {
            // throw new HttpException(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_REQUEST_BODY);
        }
        const response = await this._resumeService.deleteAttachedResume(attachedResumeId)
        return res.status(response.status).json(response)
    }

    @PUT()
    @route("/set-selected-resume/:resumeId")
    async setSelectedResume(req: Request, res: Response) {
        const resumeId = parseInt(req.params.resumeId)
        if (!resumeId) {
            // throw new HttpException(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_REQUEST_BODY);
        }
        const response = await this._resumeService.setSelectedResume(resumeId)
        return res.status(response.status).json(response)
    }

}