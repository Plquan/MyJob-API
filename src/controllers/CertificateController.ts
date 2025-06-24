import ICertificateService from "@/interfaces/certificate/ICertificateService"
import AuthenticateMiddleware from "@/middlewares/AuthenticateMiddleware"
import { before, DELETE, GET, inject, POST, PUT, route } from "awilix-express"
import { Request,Response } from "express"


@before(inject((JwtService) => AuthenticateMiddleware(JwtService)))
@route("/certificate")
export class CertificateController {

    private readonly _certificateService: ICertificateService

    constructor(CertificateService:ICertificateService){
        this._certificateService = CertificateService
    }

    @GET()
    @route("/get-certificates")
    async getAllCertificates(req: Request, res:Response) {
        const response = await this._certificateService.getAllCertificates()
        res.status(response.status).json(response)
    }

    @POST()
    @route("/create-certificate")
    async createCertificate(req: Request, res:Response) {
        const data = req.body
        const response = await this._certificateService.createCertificate(data)
        res.status(response.status).json(response)
    }

    @PUT()
    @route("/update-certificate")
    async updateCertificate(req: Request, res:Response) {
        const data = req.body
        const response = await this._certificateService.updateCertificate(data)
        res.status(response.status).json(response)
    }

    @DELETE()
    @route("/delete-certificate/:certificateId")
    async deleteCertificate(req: Request, res:Response) {
        const certificateId = parseInt(req.params.certificateId);
        const response = await this._certificateService.deleteCertificate(certificateId)
        res.status(response.status).json(response)
    }

}