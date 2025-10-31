import { ICandidateRegisterData, ILoginData, } from "@/dtos/auth/auth-dto";
import IAuthService from "@/interfaces/auth/auth-interface";
import { before, GET, inject, POST, route } from "awilix-express";
import { Request, Response } from "express";
import { ENV } from "@/common/constants/env";
import { Auth } from "@/common/middlewares";

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
    const setTokenToCookie = (refreshToken: string) => {
      res.cookie("refreshToken", refreshToken, {
        secure: true,
        sameSite: "none",
        httpOnly: true,
        maxAge: Number(ENV.REFRESH_TOKEN_EXPIRES_IN) * 1000,
      });
    };
    const response = await this._authService.candidateLogin(loginData, setTokenToCookie);
    res.status(200).json(response);
  }

  @POST()
  @route("/login/company")
  async companyLogin(req: Request, res: Response) {
    try {
      const loginData: ILoginData = req.body;
      const setTokenToCookie = ( refreshToken: string) => {
        res.cookie("refreshToken", refreshToken, {
          secure: true,
          sameSite: "none",
          httpOnly: true,
          maxAge: Number(ENV.REFRESH_TOKEN_EXPIRES_IN) * 1000,
        });
      };
      const response = await this._authService.employerLogin(loginData, setTokenToCookie);
      res.status(200).json(response);
    } catch (error) {
      throw error
    }
  }

  @POST()
  @route("/register/employer")
  async companyRegister(req: Request, res: Response) {
    const data = req.body;
    const response = await this._authService.employerRegister(data);
    res.status(201).json(response);
  }

  @POST()
  @route("/register/candidate")
  async candidateRegister(req: Request, res: Response) {
    const registerData: ICandidateRegisterData = req.body;
    const response = await this._authService.candidateRegister(registerData);
    res.status(201).json(response);
  }

  @before(inject(Auth.required))
  @GET()
  @route("/get-me")
  async getMe(req: Request, res: Response) {
    const response = await this._authService.getMe();
    res.status(200).json(response);
  }

  @POST()
  @route("/refresh-token")
  async refreshToken(req: Request, res: Response) {
    const token = req.cookies['refreshToken'];
    const setTokenToCookie = ( refreshToken: string) => {
      res.cookie("refreshToken", refreshToken, {
        secure: true,
        sameSite: "none",
        httpOnly: true,
        maxAge: Number(ENV.REFRESH_TOKEN_EXPIRES_IN) * 1000,
      });
    };
    const response = await this._authService.refreshToken(token, setTokenToCookie)
    res.status(200).json(response);
  }
}