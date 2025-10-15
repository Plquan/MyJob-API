import IAccountService from "@/interfaces/account/account-interface";
import { asyncLocalStorageMiddleware} from "@/common/middlewares";
import AuthenticateMiddleware from "@/common/middlewares/authenticate-middleware";
import { before, inject, POST, route } from "awilix-express";
import { Request, Response } from "express";
import { uploadFileMiddleware } from "@/common/middlewares/upload-middleware";

@route("/account")
export class AccountController {
    
    private readonly _accountService: IAccountService;

    constructor(AccountService: IAccountService) {
        this._accountService = AccountService
    }
    
    @before([
    inject((JwtService) => AuthenticateMiddleware(JwtService)), 
    uploadFileMiddleware,
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