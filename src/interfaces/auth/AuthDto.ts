import { IAccessTokenResponse, IRefreshTokenResponse } from "./IJwtService";
import { ICompanyData } from "../company/CompanyDto";

export interface ILoginData {
  email: string;
  password: string;
  isRememberMe: boolean;
}


export interface ICandidateRegisterData {
  email:string;
  fullName: string;
  password: string;
  groupRoleId:number;
}

export interface ICompanyRegisterData {
  email:string;
  fullName: string;
  password: string;
  companyInfo?:ICompanyData
  groupRoleId:number;
}

export interface IUserLoginResponse {
  accessToken: IAccessTokenResponse;
  refreshToken: IRefreshTokenResponse
  // userInfo: {
  //   userId: string;
  //   username: string;
  //   fullName: string;
  //   role: {
  //     roleName: string;
  //     displayName: string;
  //   };
  // };
  // permissions: IFunctionByRole[];
}

export interface IUserRegisterResponse {
  username: string;
  fullName: string;
}

export interface IFunctionByRole {
  id: string;
  name: string;
  displayName: string;
  functionLink: string;
}

export interface ICurrentUser {
  id: string;
  roleName: string;
  role: [
    {
      id: number;
      name: string;
      displayName: string;
    }
  ];
  accessToken: string;
};
