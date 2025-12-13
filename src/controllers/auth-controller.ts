import { ICandidateRegisterData, ILoginData, } from "@/dtos/auth/auth-dto";
import IAuthService from "@/interfaces/auth/auth-interface";
import { before, GET, inject, POST, route } from "awilix-express";
import { Request, Response } from "express";
import { Auth } from "@/common/middlewares";
import { COOKIE_OPTIONS, TOKEN_OPTIONS } from "@/common/constants/cookie-options";

@route('/auth')
export class AuthController {
  private readonly _authService: IAuthService;
  constructor(AuthService: IAuthService) {
    this._authService = AuthService;
  }

  @POST()
  @route("/login")
  async candidateLogin(req: Request, res: Response) {
    const data = req.body;
    const setTokenToCookie = (refreshToken: string) => {
      res.cookie("refreshToken", refreshToken, TOKEN_OPTIONS);
    };
    const response = await this._authService.login(data, setTokenToCookie);
    res.status(200).json(response);
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
    const setTokenToCookie = (refreshToken: string) => {
      res.cookie("refreshToken", refreshToken, TOKEN_OPTIONS);
    };
    const response = await this._authService.refreshToken(token, setTokenToCookie)
    res.status(200).json(response);
  }
  
  @POST()
  @route("/logout")
  async logout(req: Request, res: Response) {
    const token = req.cookies['refreshToken'];
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    const response = await this._authService.logout(token)
    res.status(200).json(response);
  }
}