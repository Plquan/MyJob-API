import { IJwtService } from "@/interfaces/auth/jwt-interface";
import { asyncLocalStorageMiddleware } from "./async-local-storage";
import validationMiddleware from "./validation-middleware";
import AuthenticateMiddleware from "./authenticate-middleware";
export {
    asyncLocalStorageMiddleware, validationMiddleware
};

export const Auth = {
  required: (JwtService: IJwtService) => AuthenticateMiddleware(JwtService),
  optional: (JwtService: IJwtService) => AuthenticateMiddleware(JwtService, { allowAnonymous: true }),
};