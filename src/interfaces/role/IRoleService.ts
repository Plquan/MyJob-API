import { IResponseBase } from "../base/IResponseBase";
import { ICreateRoleData, IFunction, IUpdateRoleData } from "./RoleDto";

export default interface IRoleService {
  getCurrentUserPermission(roleId: number): Promise<IResponseBase>
  getAllRoles(): Promise<IResponseBase>
  getAllFunctions():Promise<IResponseBase>
  createRole(data:ICreateRoleData):Promise<IResponseBase>
  updateRole(data: IUpdateRoleData): Promise<IResponseBase>
  deleteRole(roleId: number): Promise<IResponseBase>
  updateRolePermissions(roleId: number, functionIds: number[]): Promise<IResponseBase>
}