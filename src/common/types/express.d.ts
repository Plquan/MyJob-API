import { ICurrentUser } from "@/dtos/auth/auth-dto";
export {};
declare global {
  namespace Express {
    export interface Request {
      awilixRouteHandler?: Function;
      user?: ICurrentUser;
    }
  }
}