export interface IUserDto {
  id: number;
  email: string;
  isVerifyEmail: boolean;
  isActive: boolean;
  isSuperUser: boolean;
  isStaff: boolean;
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

export interface IUserFilter {
   searchKey?: string
   roleName?:string
   isActive?: boolean
   isVerifyEmail?:boolean
   page?:number
   limit?: number
}