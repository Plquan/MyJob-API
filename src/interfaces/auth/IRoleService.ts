import { IResponseBase } from "../base/IResponseBase";

export default interface IRoleService {
  getUserRoles(roleId: string): Promise<IResponseBase>;
  getCurrentUserPermission(roleId: number): Promise<IResponseBase>;
  getGroupRole(roleName:string): Promise<IResponseBase>;
  getAllGroupRoles(): Promise<IResponseBase>;
}