import { IResponseBase } from "../base/IResponseBase";
import { ILoginData, ICandidateRegisterData,ICompanyRegisterData } from "./AuthDto";

export default interface IAuthService {
  login(userLogin: ILoginData, setAccessTokenToCookie: (data: string) => void): Promise<IResponseBase>;
  candidateRegister(candidateRegister: ICompanyRegisterData): Promise<IResponseBase>;
  companyRegister(companyRegister: ICandidateRegisterData): Promise<IResponseBase>;
  getMe(): Promise<IResponseBase>;
}