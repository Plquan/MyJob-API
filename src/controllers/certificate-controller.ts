import ICertificateService from "@/interfaces/certificate/certificate-interface"
import AuthenticateMiddleware from "@/common/middlewares/authenticate-middleware"
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
        res.status(200).json(response)
    }

    @POST()
    @route("/create-certificate")
    async createCertificate(req: Request, res:Response) {
        const data = req.body
        const response = await this._certificateService.createCertificate(data)
        res.status(201).json(response)
    }

    @PUT()
    @route("/update-certificate")
    async updateCertificate(req: Request, res:Response) {
        const data = req.body
        const response = await this._certificateService.updateCertificate(data)
        res.status(200).json(response)
    }

    @DELETE()
    @route("/delete-certificate/:certificateId")
    async deleteCertificate(req: Request, res:Response) {
        const certificateId = parseInt(req.params.certificateId);
        const response = await this._certificateService.deleteCertificate(certificateId)
        res.status(200).json(response)
    }

}