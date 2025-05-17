import { IResponseBase } from "../base/IResponseBase";
import { ILoginData, ICandidateRegisterData,ICompanyRegisterData } from "./AuthDto";

export default interface IAuthService {
  candidateLogin(userLogin: ILoginData, storeAccessToken: (data: string) => void): Promise<IResponseBase>;
  companyLogin(userLogin: ILoginData, storeAccessToken: (data: string) => void): Promise<IResponseBase>;
  candidateRegister(candidateRegister: ICandidateRegisterData): Promise<IResponseBase>;
  companyRegister(companyRegister: ICompanyRegisterData): Promise<IResponseBase>;
  getMe(): Promise<IResponseBase>;
}