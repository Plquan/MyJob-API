import AuthenticateMiddleware from "@/common/middlewares/authenticate-middleware";
import ICandidateService from "@/interfaces/candidate/candidate-interface";
import { before, GET, inject, PUT, route } from "awilix-express";
import { Request, Response } from "express";

@before(inject((JwtService) => AuthenticateMiddleware(JwtService)))
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
        return res.status(response.status).json(response)
    }

    @PUT()
    @route("/update-profile")
    async updateProfile(req: Request, res: Response) {
        const data = req.body
        const response = await this._candidateService.updateProfile(data)
        return res.status(response.status).json(response)
    }

    @PUT()
    @route("/allow-search")
    async allowSearch(req: Request, res: Response) {
        const { status } = req.body
        const response = await this._candidateService.allowSearch(status)
        return res.status(response.status).json(response)
    }
}