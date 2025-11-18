import { IJwtService, ITokenPayload } from "@/interfaces/auth/jwt-interface";
import "dotenv/config";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "../enums/status-code/status-code.enum";

interface AuthenticateOptions {
  allowAnonymous?: boolean;
}

function AuthenticateMiddleware(
  JwtService: IJwtService,
  options?: AuthenticateOptions
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
      if (options?.allowAnonymous) {
        req.user = null;
        return next();
      }

      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: "Can not find accessToken"
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
        message: "Invalid token"
      });
      return;
    }

    const payload: ITokenPayload = JwtService.getTokenPayload(accessToken);
    req.user = {
      id: payload?.userId,
      fullName: payload?.fullName,
      isSuperUser: payload?.isSuperUser,
      role: payload?.role,
      function: [],
      accessToken: accessToken,
      companyId: payload?.companyId,
      candidateId: payload?.candidateId,
    };
    next();
  };
}

export default AuthenticateMiddleware;
