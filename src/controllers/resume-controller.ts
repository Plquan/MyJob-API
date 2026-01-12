import IResumeService from "@/interfaces/resume/resume-interface";
import { asyncLocalStorageMiddleware, Auth } from "@/common/middlewares";
import { GET, route, PUT, before, inject, POST, DELETE } from "awilix-express";
import { Request, Response } from "express";
import { uploadFileMiddleware } from "@/common/middlewares/upload-middleware";
import { ISearchResumesReqParams } from "@/dtos/resume/resume-dto";

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
        return res.status(200).json(response)
    }

    @before([uploadFileMiddleware])
    @POST()
    @route("/create-resume")
    async uploadAttachedResume(req: Request, res: Response) {
        const file = req.file
        const data = JSON.parse(req.body.data)
        const candidateId = req.user.candidateId
        const response = await this._resumeService.createResume(data, file, candidateId)
        return res.status(201).json(response)
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
        return res.status(200).json(response)
    }

    @GET()
    @route("/get-resumes")
    async getAllAttachedResumes(req: Request, res: Response) {
        const response = await this._resumeService.getResumes()
        return res.status(200).json(response)
    }

    @DELETE()
    @route("/delete-resume/:attachedResumeId")
    async deleteAttachedResume(req: Request, res: Response) {
        const attachedResumeId = parseInt(req.params.attachedResumeId)
        const response = await this._resumeService.deleteResume(attachedResumeId)
        return res.status(204).json(response)
    }

    @PUT()
    @route("/set-selected-resume/:resumeId")
    async setSelectedResume(req: Request, res: Response) {
        const resumeId = parseInt(req.params.resumeId)
        const response = await this._resumeService.setSelectedResume(resumeId)
        return res.status(200).json(response)
    }

    @GET()
    @route("/search-resumes")
    async searchResumes(req: Request, res: Response) {
        const {
            page = 1,
            limit = 10,
            title,
            provinceId,
            careerId,
            position,
            typeOfWorkPlace,
            experience,
            academicLevel,
            jobType
        } = req.query;

        const params: ISearchResumesReqParams = {
            page: +page,
            limit: +limit,
            title: title?.toString(),
            provinceId: provinceId ? +provinceId : undefined,
            careerId: careerId ? +careerId : undefined,
            position: position ? +position : undefined,
            typeOfWorkPlace: typeOfWorkPlace ? +typeOfWorkPlace : undefined,
            experience: experience ? +experience : undefined,
            academicLevel: academicLevel ? +academicLevel : undefined,
            jobType: jobType ? +jobType : undefined,
        };

        const response = await this._resumeService.searchResumes(params);
        return res.status(200).json(response);
    }

    @GET()
    @route("/get-resume-for-download/:resumeId")
    async getResumeForDownload(req: Request, res: Response) {
        const resumeId = parseInt(req.params.resumeId)
        const response = await this._resumeService.getResumeForDownload(resumeId)
        return res.status(200).json(response)
    }

    @GET()
    @route("/:resumeId")
    async getResumeById(req: Request, res: Response) {
        const resumeId = parseInt(req.params.resumeId)
        const response = await this._resumeService.getResumeById(resumeId)
        return res.status(200).json(response)
    }
    
    @GET()
    @route("/get-resume-detail/:resumeId")
    async getResumeDetail(req: Request, res: Response) {
        const resumeId = parseInt(req.params.resumeId)
        const response = await this._resumeService.getResumeDetail(resumeId)
        return res.status(200).json(response)
    }


}