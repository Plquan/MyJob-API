import ILanguageService from "@/interfaces/language/language-interface"
import { before, DELETE, GET, inject, POST, PUT, route } from "awilix-express"
import { Request, Response } from "express"
import { Auth } from "@/common/middlewares"

@before(inject(Auth.required))
@route("/language")
export class LanguageController {

    private readonly _languageService: ILanguageService
    
    constructor(LanguageService: ILanguageService){
        this._languageService = LanguageService
    }

    @GET()
    @route("/get-languages")
    async getAllLanguages(req: Request, res: Response){
        const response = await this._languageService.getAllLanguages()
        res.status(response.status).json(response)
    }

    @POST()
    @route("/create-language")
    async createLanguage(req: Request, res: Response){
        const data = req.body
        const response = await this._languageService.createLanguage(data)
        res.status(response.status).json(response)
    }

    @PUT()
    @route("/update-language")
    async updateLanguage(req: Request, res: Response){
        const data = req.body
        const response = await this._languageService.updateLanguage(data)
        res.status(response.status).json(response)
    }

    @DELETE()
    @route("/delete-language/:languageId")
    async deleteLanguage(req: Request, res: Response){
        const languageId = parseInt(req.params.languageId);
        const response = await this._languageService.deleteLanguage(languageId)
        res.status(response.status).json(response)
    }
}