import { VariableSystem } from "@/common/constants/VariableSystem";
import { EUserRole } from "@/common/enums/user/user-role-enum";
export interface IUser {
  id: number;
  avatarId?: number;
  email: string;
  fullName: string;
  password: string;
  isVerifyEmail: boolean;
  isActive: boolean;
  isDeleted: boolean;
  isSuperUser: boolean;
  isStaff: boolean;
  roleName?: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface IUpdateUser{
    id: number
    email: string
    fullName: string
    password:string
    isVerifyEmail: boolean
    isActive: boolean
    groupRoles?: number[]
    isSuperUser: boolean
    isStaff: boolean
}
export interface ICreateUser{
    email: string
    fullName: string
    password:string
    isVerifyEmail: boolean
    isActive: boolean
    roleName?: EUserRole
    groupRoles?: number[]
    isSuperUser: boolean
    isStaff: boolean
}

export interface IUserFilter {
   searchKey?: string
   roleName?:string
   isActive?: boolean
   isVerifyEmail?:boolean
   page?:number
   limit?: number
}