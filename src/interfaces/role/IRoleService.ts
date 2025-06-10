import { IResponseBase } from "../base/IResponseBase";
import { ICreateRoleData, IFunction, IUpdateRoleData, IUpdateRolePermission } from "./RoleDto";

export default interface IRoleService {
  getCurrentUserPermission(roleId: number): Promise<IResponseBase>
  getAllRoles(): Promise<IResponseBase>
  getAllFunctions():Promise<IResponseBase>
  createRole(data:ICreateRoleData):Promise<IResponseBase>
  updateRole(data: IUpdateRoleData): Promise<IResponseBase>
  deleteRole(roleId: number): Promise<IResponseBase>
  updateRolePermissions(data:IUpdateRolePermission): Promise<IResponseBase>
  getRoleById(roleId: number): Promise<IResponseBase>
  updateUserGroupRole(userId:number,groupRole: number[]):Promise<IResponseBase>
}