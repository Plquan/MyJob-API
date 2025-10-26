import { IResponseBase } from "../base/IResponseBase";
import { ILoginData, ICandidateRegisterData,ICompanyRegisterData } from "../../dtos/auth/auth-dto";

export default interface IAuthService {
  candidateLogin(userLogin: ILoginData,setTokenToCookie: (refreshToken: string) => void): Promise<string>;
  employerLogin(userLogin: ILoginData,setTokenToCookie: (refreshToken: string) => void): Promise<string>;
  candidateRegister(candidateRegister: ICandidateRegisterData): Promise<boolean>;
  employerRegister(companyRegister: ICompanyRegisterData): Promise<boolean>;
  getMe(): Promise<IResponseBase>;
  refreshToken(refreshToken: string,setTokensToCookie: (newRefreshToken: string) => void):Promise<string>
}