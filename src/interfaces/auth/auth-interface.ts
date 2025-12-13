import { ILoginData, ICandidateRegisterData,ICompanyRegisterData, ICurrentUser, ILoginRequest } from "../../dtos/auth/auth-dto";
export default interface IAuthService {
  login(userLogin: ILoginRequest,setTokenToCookie: (refreshToken: string) => void): Promise<string>;
  candidateRegister(candidateRegister: ICandidateRegisterData): Promise<boolean>;
  employerRegister(companyRegister: ICompanyRegisterData): Promise<boolean>;
  getMe(): Promise<ICurrentUser>;
  refreshToken(refreshToken: string,setTokensToCookie: (newRefreshToken: string) => void):Promise<string>
  logout(refreshToken: string):Promise<boolean>
}