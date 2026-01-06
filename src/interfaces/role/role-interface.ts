import { ICreateRoleData, IFunction, IUpdateRoleData, IUpdateRolePermission, IRoleDto, IRoleWithFunctions } from "../../dtos/role/role-dto";

export default interface IRoleService {
  getCurrentUserPermission(roleId: number): Promise<string[]>
  getAllRoles(): Promise<IRoleDto[]>
  getAllFunctions():Promise<IFunction[]>
  createRole(data:ICreateRoleData):Promise<IRoleDto>
  updateRole(data: IUpdateRoleData): Promise<IRoleDto>
  deleteRole(roleId: number): Promise<boolean>
  updateRolePermissions(data:IUpdateRolePermission): Promise<boolean>
  getRoleById(roleId: number): Promise<IRoleWithFunctions>
  updateUserGroupRole(userId:number,groupRole: number[]):Promise<boolean>
}