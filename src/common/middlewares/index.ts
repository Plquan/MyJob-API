import { IJwtService } from "@/interfaces/auth/jwt-interface";
import { asyncLocalStorageMiddleware } from "./async-local-storage";
import AuthenticateMiddleware from "./authenticate-middleware";
export {
    asyncLocalStorageMiddleware
};

export const Auth = {
  required: (JwtService: IJwtService) => AuthenticateMiddleware(JwtService),
  optional: (JwtService: IJwtService) => AuthenticateMiddleware(JwtService, { allowAnonymous: true }),
};