import { ICurrentUser } from "@/interfaces/auth/AuthDto";
export {};
declare global {
  namespace Express {
    export interface Request {
      user?: ICurrentUser;
    }
  }
}