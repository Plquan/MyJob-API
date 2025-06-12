import ICandidateService from "@/interfaces/candidate/ICandidateService";
import AuthenticateMiddleware from "@/middlewares/AuthenticateMiddleware";
import { before, GET, inject, route } from "awilix-express";
import { Request, Response } from "express";

@before(inject((JwtService) => AuthenticateMiddleware(JwtService)))
@route('/candidate')
export class CandidateController {
    private readonly _candidateService: ICandidateService

    constructor(CandidateService: ICandidateService){
        this._candidateService = CandidateService
    }

    @GET()
    @route("/get-candidate-online-resume")
    async getCandidateOnlineResume (req: Request, res: Response){
        const response = await this._candidateService.getCandidateOnlineResume()
        return res.status(response.status).json(response)
    }

}