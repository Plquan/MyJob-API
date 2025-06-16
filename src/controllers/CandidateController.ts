import ICandidateService from "@/interfaces/candidate/ICandidateService";
import AuthenticateMiddleware from "@/middlewares/AuthenticateMiddleware";
import { before, GET, inject, POST, PUT, route } from "awilix-express";
import { Request, Response } from "express";

@before(inject((JwtService) => AuthenticateMiddleware(JwtService)))
@route('/candidate')
export class CandidateController {
    private readonly _candidateService: ICandidateService

    constructor(CandidateService: ICandidateService){
        this._candidateService = CandidateService
    }



    @PUT()
    @route("/update-profile")
    async updateProfile(req:Request, res: Response){
        const data = req.body
        const response = await this._candidateService.updateProfile(data)
        return res.status(response.status).json(response)
    }

   

}