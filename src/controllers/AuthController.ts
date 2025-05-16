import { ICandidateRegisterData, ICompanyRegisterData, ILoginData,  } from "@/interfaces/auth/AuthDto";
import IAuthService from "@/interfaces/auth/IAuthService";
import { before, GET, inject, POST, PUT, route } from "awilix-express";
import { Request, Response } from "express";

@route('/auth')
export class AuthController {
    private readonly _AuthService: IAuthService;
    constructor(AuthService: IAuthService) {
        this._AuthService = AuthService;
      }

      @POST()
      @route("/login")
      async login(req: Request, res: Response) {
        const loginData: ILoginData = req.body;
        const setAccessTokenToCookie = (data: string) => {
          res.cookie("accessToken", data, {
            secure: true,
            sameSite: "none",
          });
        };
        const response = await this._AuthService.login(loginData, setAccessTokenToCookie);
        res.status(response.status).json(response);
      }

      @POST()
      @route("/register/company")
      async companyRegister(req: Request, res: Response) {
        const registerData: ICompanyRegisterData = req.body;
        const response = await this._AuthService.companyRegister(registerData);
        res.status(response.status).json(response);
      }

      @POST()
      @route("/register/candidate")
      async candidateRegister(req: Request, res: Response) {
        const registerData: ICandidateRegisterData = req.body;
        const response = await this._AuthService.candidateRegister(registerData);
        res.status(response.status).json(response);
      }  
       
}