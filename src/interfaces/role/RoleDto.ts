export interface IFunction {
  id:number
  name: string;
}

export interface IRoleDto {
  id:number
  name:string
  description?: string;
}
export interface IRoleWithFunctions extends IRoleDto {
  functions: IFunction[];
}

export interface ICreateRoleData {
  name: string;
  description?: string;
}

export interface IUpdateRoleData {
  id:number
  name: string;
  description?: string;
}