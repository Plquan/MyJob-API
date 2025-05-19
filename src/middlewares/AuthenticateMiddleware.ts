import { ENV } from "@/constants/env";
import { ErrorMessages } from "@/constants/ErrorMessages";
import { IJWTService } from "@/interfaces/auth/IJwtService";
import "dotenv/config";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";

function AuthenticateMiddleware(JwtService: IJWTService): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    let accessToken = "";


    const cookies = req.cookies;
    if (cookies && cookies["accessToken"]) {
      accessToken = cookies["accessToken"];
    }

    if (!accessToken) {
       res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        error: {
          message: "Unauthorized",
          errorDetail: "Unauthorized",
        },
        success: false,
        data: null,
        ErrorMessages: ErrorMessages.UNAUTHORIZED,
      });
      return
    }

    const payload: any = JwtService.getTokenPayload(accessToken);
    const isValid: boolean = JwtService.verifyAccessToken(accessToken);

    if (!isValid) {
       res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        error: {
          message: "Token không hợp lệ",
          errorDetail: "Invalid token",
        },
        success: false,
        data: null,
        ErrorMessages: ErrorMessages.UNAUTHORIZED,
      });
      return
    }

    req.user = {
      id: payload?.userId || payload?.userid,
      roleName: payload?.roleName,
      role: payload?.role,
      accessToken: accessToken,
    };
    console.log(req.user)
    next();
  };
}

export default AuthenticateMiddleware;