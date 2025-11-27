
import { EUserRole } from "@/common/enums/user/user-role-enum";
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
  id: number;
  email: string;
  fullName: string;
  role: EUserRole;          
  isStaff: boolean;
  isActive: boolean;
  allowSearch: boolean;        
  avatar?: string | null;     
  companyId?: number | null;    
}

export interface IUserClaim {
  id: number;
  fullName: string;
  role: string;
  function: string[]
  isSuperUser:boolean
  accessToken: string;
};
