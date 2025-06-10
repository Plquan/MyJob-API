import IRoleService from "@/interfaces/role/IRoleService";
import { IResponseBase } from "@/interfaces/base/IResponseBase";
import DatabaseService from "../common/DatabaseService";
import { StatusCodes } from "http-status-codes";
import logger from "@/helpers/logger";
import { ICreateRoleData, IUpdateRoleData } from "@/interfaces/role/RoleDto";

export default class RoleService implements IRoleService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }
    async deleteRole(roleId: number): Promise<IResponseBase> {
      try {
          const role = await this._context.RoleRepo.findOne({
            where: { id: roleId }})
          if(!role){
            return {
              status: StatusCodes.BAD_REQUEST,
              success:false,
              message: "Nhóm quyền không tồn tại",
              data: null,
              error: {
                message: "Nhóm quyền không tồn tại",
                errorDetail: "Không tìm thấy nhóm quyền",
              }
            }
          }
          const result = await this._context.RoleRepo.delete(roleId)

          if (result.affected === 0) {
            return {
              status: StatusCodes.BAD_REQUEST,
              success: false,
              message: "Không thể xóa vai trò",
              data: null,
              error: {
                message: "Không thể xóa",
                errorDetail: "Không có bản ghi nào bị xóa",
              }
            };
          }
          
          return {
            status: StatusCodes.OK,
            success: true,
            message: "Xoá nhóm quyền thành công",
            data:roleId
          }


      } catch (error) {
          logger.error(error?.message);
              console.log(
                  `Error in RoleService - method deleteRole() at ${new Date().getTime()} with message ${error?.message}`
              );
              return {
                  status: StatusCodes.INTERNAL_SERVER_ERROR,
                  success: false,
                  message: error?.message,
                  data: null,
                  error: {
                  message: "Internal Server Error",
                  errorDetail: "Internal Server Error",
                  },
              };
      }
    }
    async updateRole(data: IUpdateRoleData): Promise<IResponseBase> {
      try {
        const role = await this._context.RoleRepo.findOne({
          where:{id:data.id}
        })
        if(!role){
          return {
            status: StatusCodes.BAD_REQUEST,
            success:false,
            message: "Vai trò không tồn tại",
            data: null,
            error: {
              message: "Vai trò không tồn tại",
              errorDetail: "Không tìm thấy vai trò",
            }
          }
        }

        this._context.RoleRepo.merge(role, data);
        await this._context.RoleRepo.save(role);

        return {
          status: StatusCodes.OK,
          success: true,
          message: "Cập nhật vai trò thành công",
          data: role,
        }

      } catch (error) {
          logger.error(error?.message);
              console.log(
                  `Error in RoleService - method createRole() at ${new Date().getTime()} with message ${error?.message}`
              );
              return {
                  status: StatusCodes.INTERNAL_SERVER_ERROR,
                  success: false,
                  message: error?.message,
                  data: null,
                  error: {
                  message: "Internal Server Error",
                  errorDetail: "Internal Server Error",
                  },
              }
      }
    }
    async createRole(data:ICreateRoleData): Promise<IResponseBase> {
      try {
        if(!data.name || data.name.trim() === "") {
            return {
                status: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Tên vai trò không được để trống",
                data: null,
                error: {
                    message: "Tên vai trò không được để trống",
                    errorDetail: "Tên vai trò không được để trống",
                },
            };
        }
        const existingRole = await this._context.RoleRepo.findOne({
            where: { name: data.name }
        })

        if(existingRole){
          return {
            status:StatusCodes.BAD_REQUEST,
            success:false,
            message: "Nhóm quyền đã tồn tại",
            data:null,
            error: {
                message: "Nhóm quyền đã tồn tại",
                errorDetail: "Nhóm quyền đã tồn tại",
            },
          }
        }
        const newRole = this._context.RoleRepo.create(data)
        const savedRole = await this._context.RoleRepo.save(newRole)

        return {
            status: StatusCodes.CREATED,
            success: true,
            message: "Tạo nhóm quyền thành công",
            data: savedRole,
        }
      } catch (error) {
          logger.error(error?.message);
            console.log(
                `Error in RoleService - method createRole() at ${new Date().getTime()} with message ${error?.message}`
            );
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Internal Server Error",
                data: null,
                error: {
                message: "Internal Server Error",
                errorDetail: "Internal Server Error",
                },
            };
      }
    }
    async getCurrentUserPermission(userId: number): Promise<IResponseBase> {
        try {
          const userPermissions = await this._context.FunctionRepo.createQueryBuilder("function")
            .distinct(true)
            .innerJoin("function.permissions", "permission")
            .innerJoin("permission.role", "role")
            .innerJoin("role.groupRole", "groupRole")
            .where("groupRole.userId = :userId", { userId })
            .andWhere("function.isActive = :isActive", { isActive: true })
            .andWhere("function.isDeleted = :isDeleted", { isDeleted: false })
            .select([
              "function.id",
              "function.name",
              "function.displayName",
            ])
            .getMany();
            return {
                status: StatusCodes.OK,
                success: true,
                data: userPermissions,
                error: null,
              };
        } catch (error) {
            logger.error(error?.message);
            console.log(
                `Error in RoleService - method getCurrentUserPermission() at ${new Date().getTime()} with message ${error?.message}`
            );
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Internal Server Error",
                data: null,
                error: {
                message: "Internal Server Error",
                errorDetail: "Internal Server Error",
                },
            }
        }
    }
    async getAllRoles(): Promise<IResponseBase> {   
       try {
          const roles = await this._context.RoleRepo.find()

          return {
            status: StatusCodes.OK,
            success:true,
            message:"Lấy danh sách vai trò thành công",
            data: roles         
          }

        } catch (error) {
           logger.error(error?.message);
            console.log(
                `Error in RoleService - method getAllRoles() at ${new Date().getTime()} with message ${error?.message}`
            )
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: error.message,
                data: null,
                error: {
                message: "Internal Server Error",
                errorDetail: "Internal Server Error",
                }
            }
        }
    }
    async getAllFunctions(): Promise<IResponseBase> {
    try { 
      const functions = await this._context.FunctionRepo.find()

      return {
        status: StatusCodes.ACCEPTED,
        success: false,
        message: "Lấy danh sách quyền thành công",
        data: functions,
      }

    } catch (error) {
        logger.error(error?.message);
            console.log(
                `Error in RoleService - method getAllFunctions() at ${new Date().getTime()} with message ${error?.message}`
            );
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: error?.message,
                data: null,
                error: {
                message: "Internal Server Error",
                errorDetail: "Internal Server Error",
                },
            }
    } 
    }  
    updateRolePermissions(roleId: number, functionIds: number[]): Promise<IResponseBase> {
      throw new Error("Method not implemented.");
    }
}