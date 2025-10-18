import { ErrorMessages } from "@/common/constants/ErrorMessages";
import { IJwtService, ITokenPayload } from "@/interfaces/auth/jwt-interface";
import "dotenv/config";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface AuthenticateOptions {
  allowAnonymous?: boolean;
}

function AuthenticateMiddleware(
  JwtService: IJwtService,
  options?: AuthenticateOptions
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    let accessToken = "";
    const cookies = req.cookies;
    accessToken = cookies["accessToken"];

    if (!accessToken) {
      if (options?.allowAnonymous) {
        req.user = null;
        return next();
      }

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
      return;
    }

    const isValid: boolean = JwtService.verifyAccessToken(accessToken);

    if (!isValid) {
      if (options?.allowAnonymous) {
        req.user = null;
        return next();
      }

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
      return;
    }

    const payload: ITokenPayload = JwtService.getTokenPayload(accessToken);

    req.user = {
      id: payload?.userId,
      fullName: payload?.fullName,
      isSuperUser: payload?.isSuperUser,
      roleName: payload?.roleName,
      function: [],
      accessToken: accessToken,
      companyId: payload?.companyId,
      candidateId: payload?.candidateId,
    };

    next();
  };
}

export default AuthenticateMiddleware;
