import IAccountService from "@/interfaces/account/IAccountService";
import { asyncLocalStorageMiddleware} from "@/middlewares";
import AuthenticateMiddleware from "@/middlewares/AuthenticateMiddleware";
import { uploadAvatarMiddleware } from "@/middlewares/uploadMiddleware";
import { before, inject, POST, route } from "awilix-express";
import { Request, Response } from "express";

@route("/account")
export class AccountController {
    
    private readonly _accountService: IAccountService;

    constructor(AccountService: IAccountService) {
        this._accountService = AccountService
    }
    
    @before([
    inject((JwtService) => AuthenticateMiddleware(JwtService)), 
    uploadAvatarMiddleware,
    asyncLocalStorageMiddleware()])
    @POST()
    @route("/update-avatar")
    async updateAvatar(req: Request, res: Response) {
        const file = req.file;
        console.log(file)
        const response = await this._accountService.updateAvatar(file);
        return res.status(response.status).json(response);
    }
}