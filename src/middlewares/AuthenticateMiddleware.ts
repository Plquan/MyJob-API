import { ErrorMessages } from "@/constants/ErrorMessages";
import { IJwtService, ITokenPayload } from "@/interfaces/auth/IJwtService";
import "dotenv/config";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "awilix-express";

function AuthenticateMiddleware(JwtService: IJwtService): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {

      let accessToken = "";
    
       const cookies = req.cookies;
        accessToken = cookies["accessToken"];

      if (!accessToken) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: StatusCodes.UNAUTHORIZED,
          error: {
            message: "Không tìm thấy accessToken",
            errorDetail: "Không tìm thấy accessToken",
          },
          success: false,
          data: null,
          ErrorMessages: ErrorMessages.UNAUTHORIZED,
        });
        return
      }

    const payload: ITokenPayload = JwtService.getTokenPayload(accessToken);
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
      id: payload?.userId,
      fullName: payload?.fullName,
      isSuperUser: payload?.isSuperUser,
      roleName: payload?.roleName,
      function: [],
      accessToken: accessToken,
    };
    next();
  };
}

export default AuthenticateMiddleware

export function authenticate() {
   return inject((JwtService) => AuthenticateMiddleware(JwtService))
}