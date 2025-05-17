import { LocalStorage } from "@/constants/LocalStorage";
import { ICandidateRegisterData, ICompanyRegisterData, ILoginData,  } from "@/interfaces/auth/AuthDto";
import IAuthService from "@/interfaces/auth/IAuthService";
import AuthenticateMiddleware from "@/middlewares/AuthenticateMiddleware";
import { RequestStorage } from "@/middlewares/AsyncLocalStorage";
import { before, GET, inject, POST, PUT, route } from "awilix-express";
import { Request, Response } from "express";

@route('/auth')
export class AuthController {
    private readonly _AuthService: IAuthService;
    constructor(AuthService: IAuthService) {
        this._AuthService = AuthService;
      }

      @POST()
      @route("/login/candidate")
      async candidateLogin(req: Request, res: Response) {
        const loginData: ILoginData = req.body;
        const setAccessTokenToCookie = (data: string) => {
          res.cookie("accessToken", data, {
            secure: true,
            sameSite: "none",
          });
        };
        const response = await this._AuthService.candidateLogin(loginData, setAccessTokenToCookie);
        res.status(response.status).json(response);
      }

      @POST()
      @route("/login/company")
      async companyLogin(req: Request, res: Response) {
        const loginData: ILoginData = req.body;
        const setAccessTokenToCookie = (data: string) => {
          res.cookie("accessToken", data, {
            secure: true,
            sameSite: "none",
          });
        };
        const response = await this._AuthService.companyLogin(loginData, setAccessTokenToCookie);
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

      @before(inject((JwtService) => AuthenticateMiddleware(JwtService)))
      @GET()
      @route("/get-me")
      async getMe(req: Request, res: Response){
      const response = await this._AuthService.getMe();
      res.status(response.status).json(response);
      }
       
}