import { IResponseBase } from "../base/IResponseBase";
import { IFunction } from "./RoleDto";

export default interface IRoleService {
  getUserRoles(roleId: string): Promise<IResponseBase>;
  getCurrentUserPermission(roleId: number): Promise<IResponseBase>;
  getGroupRole(roleName:string): Promise<IResponseBase>;
  getAllRoles(): Promise<IResponseBase>;
  getAllFunctions():Promise<IResponseBase>;
}