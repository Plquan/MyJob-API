import { ICandidateRegisterData, ICompanyRegisterData, ILoginData,  } from "@/dtos/auth/auth-dto";
import IAuthService from "@/interfaces/auth/auth-interface";
import AuthenticateMiddleware from "@/common/middlewares/authenticate-middleware";
import { before, GET, inject, POST, PUT, route } from "awilix-express";
import { Request, Response } from "express";
import { ENV } from "@/common/constants/env";

@route('/auth')
export class AuthController {
    private readonly _authService: IAuthService;
    constructor(AuthService: IAuthService) {
        this._authService = AuthService;
      }

      @POST()
      @route("/login/candidate")
      async candidateLogin(req: Request, res: Response) {
        const loginData: ILoginData = req.body;
       const setTokensToCookie = (accessToken: string, refreshToken: string) => {
          res.cookie("accessToken", accessToken, {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            maxAge: Number(ENV.ACCESS_TOKEN_EXPIRES_IN) * 1000,
          });

          res.cookie("refreshToken", refreshToken, {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            maxAge: Number(ENV.REFRESH_TOKEN_EXPIRES_IN) * 1000,
          });
        };
        const response = await this._authService.candidateLogin(loginData, setTokensToCookie);
        res.status(response.status).json(response);
      }

      @POST()
      @route("/login/company")
      async companyLogin(req: Request, res: Response) {
        const loginData: ILoginData = req.body;
         const setTokensToCookie = (accessToken: string, refreshToken: string) => {
          res.cookie("accessToken", accessToken, {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            maxAge: Number(ENV.ACCESS_TOKEN_EXPIRES_IN) * 1000,
          });

          res.cookie("refreshToken", refreshToken, {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            maxAge: Number(ENV.REFRESH_TOKEN_EXPIRES_IN) * 1000,
          });
        };
        const response = await this._authService.companyLogin(loginData, setTokensToCookie);
        res.status(response.status).json(response);
      }

      @POST()
      @route("/register/company")
      async companyRegister(req: Request, res: Response) {
        const registerData: ICompanyRegisterData = req.body;
        const response = await this._authService.companyRegister(registerData);
        res.status(response.status).json(response);
      }

      @POST()
      @route("/register/candidate")
      async candidateRegister(req: Request, res: Response) {
        const registerData: ICandidateRegisterData = req.body;
        const response = await this._authService.candidateRegister(registerData);
        res.status(response.status).json(response);
      }  

      @before(inject((JwtService) => AuthenticateMiddleware(JwtService)))
      @GET()
      @route("/get-me")
      async getMe(req: Request, res: Response){
      const response = await this._authService.getMe();
      res.status(response.status).json(response);
      }

      @POST()
      @route("/refresh-token")
      async refreshToken(req:Request,res:Response){
        const token = req.cookies['refreshToken'];
          const setTokensToCookie = (accessToken: string, refreshToken: string) => {
          res.cookie("accessToken", accessToken, {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            maxAge: Number(ENV.ACCESS_TOKEN_EXPIRES_IN) * 1000,
          });

          res.cookie("refreshToken", refreshToken, {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            maxAge: Number(ENV.REFRESH_TOKEN_EXPIRES_IN) * 1000,
          });
        };
        const response = await this._authService.refreshToken(token,setTokensToCookie)
         res.status(response.status).json(response);
      } 
}