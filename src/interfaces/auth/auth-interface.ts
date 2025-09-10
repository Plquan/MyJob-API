import { IResponseBase } from "../base/IResponseBase";
import { ILoginData, ICandidateRegisterData,ICompanyRegisterData } from "../../dtos/auth/auth-dto";

export default interface IAuthService {
  candidateLogin(userLogin: ILoginData,setTokensToCookie: (accessToken: string, refreshToken: string) => void): Promise<IResponseBase>;
  companyLogin(userLogin: ILoginData,setTokensToCookie: (accessToken: string, refreshToken: string) => void): Promise<IResponseBase>;
  candidateRegister(candidateRegister: ICandidateRegisterData): Promise<IResponseBase>;
  companyRegister(companyRegister: ICompanyRegisterData): Promise<boolean>;
  getMe(): Promise<IResponseBase>;
  refreshToken(refreshToken: string,setTokensToCookie: (newAccessToken: string, newRefreshToken: string) => void):Promise<IResponseBase>
}