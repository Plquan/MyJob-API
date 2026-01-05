import { Auth } from "@/common/middlewares";
import ICandidateService from "@/interfaces/candidate/candidate-interface";
import { before, GET, inject, PUT, route } from "awilix-express";
import { Request, Response } from "express";
@before(inject(Auth.required))
@route('/candidate')
export class CandidateController {
    private readonly _candidateService: ICandidateService

    constructor(CandidateService: ICandidateService) {
        this._candidateService = CandidateService
    }

    @GET()
    @route("/get-profile")
    async getProfile(req: Request, res: Response) {
        const response = await this._candidateService.getProfile()
        return res.status(200).json(response)
    }

    @PUT()
    @route("/update-profile")
    async updateProfile(req: Request, res: Response) {
        const data = req.body
        const response = await this._candidateService.updateProfile(data)
        return res.status(200).json(response)
    }

    @PUT()
    @route("/allow-search")
    async allowSearch(req: Request, res: Response) {
        const { status } = req.body
        const response = await this._candidateService.allowSearch(status)
        return res.status(200).json(response)
    }

    @GET()
    @route("/activity-statistics")
    async getUserActivityStatistics(req: Request, res: Response) {
        const response = await this._candidateService.getUserActivityStatistics()
        return res.status(200).json(response)
    }

    @GET()
    @route("/recommended-jobs")
    async getRecommendedJobs(req: Request, res: Response) {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
        const response = await this._candidateService.getRecommendedJobs(limit)
        return res.status(200).json(response)
    }
}