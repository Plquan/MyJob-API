import IRoleService from "@/interfaces/role/IRoleService";
import { IResponseBase } from "@/interfaces/base/IResponseBase";
import DatabaseService from "../common/DatabaseService";
import { StatusCodes } from "http-status-codes";
import logger from "@/helpers/logger";
import { ICreateRoleData, IUpdateRoleData, IUpdateRolePermission } from "@/interfaces/role/RoleDto";
import { Permission } from "@/entity/Permission";
import { In } from "typeorm";

export default class RoleService implements IRoleService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }
  
    async getRoleById(roleId: number): Promise<IResponseBase> {
      try {
          const role = await this._context.RoleRepo
            .createQueryBuilder("role")
            .leftJoin("role.permissions", "permission")
            .leftJoin("permission.function", "function")
            .select([
              "role.id as id",
              "role.name as name",
              "role.description as description",
              'json_agg(function.id) as "functionIds"'
            ])
            .where("role.id = :id", { id: roleId })
            .groupBy("role.id")
            .getRawOne();

            if(!role){
              return {
                status: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Vai trò không tồn tại"
              }
            }
            return {
              status: StatusCodes.OK,
              success: true,
              message: "Lấy thông tin vai trò thành công",
              data: role,
            } 
       } catch (error) {
          logger.error(error?.message);
            console.error(`Error in RoleService.getRoleById at ${new Date().toISOString()}:`, error);

            return {
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              success: false,
              message: "Lỗi hệ thống",
            }
      }
    }
    async deleteRole(roleId: number): Promise<IResponseBase> {
      try {
          const role = await this._context.RoleRepo.findOne({
            where: { id: roleId }})
          if(!role){
            return {
              status: StatusCodes.BAD_REQUEST,
              success:false,
              message: "Nhóm quyền không tồn tại"
            }
          }
          const result = await this._context.RoleRepo.delete(roleId)

          if (result.affected === 0) {
            return {
              status: StatusCodes.BAD_REQUEST,
              success: false,
              message: "Không thể xóa vai trò",
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
                  message: "Internal Server Error",
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
            message: "Vai trò không tồn tại"
          }
        }

        this._context.RoleRepo.merge(role, data);
        await this._context.RoleRepo.save(role)

        const updatedRole = await this.getRoleById(role.id)

        if(!updatedRole.success) {
          return {
            status: StatusCodes.BAD_REQUEST,
            success: false,
            message: "Cập nhật vai trò thất bại"
          }
        }

        return {
          status: StatusCodes.OK,
          success: true,
          message: "Cập nhật vai trò thành công",
          data: updatedRole.data,
        }

      } catch (error) {
          logger.error(error?.message);
              console.log(
                  `Error in RoleService - method createRole() at ${new Date().getTime()} with message ${error?.message}`
              );
              return {
                  status: StatusCodes.INTERNAL_SERVER_ERROR,
                  success: false,
                  message: "Internal Server Error"
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
            };
        }
        const existingRole = await this._context.RoleRepo.findOne({
            where: { name: data.name }
        })

        if(existingRole){
          return {
            status:StatusCodes.BAD_REQUEST,
            success:false,
            message: "Nhóm quyền đã tồn tại"
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
            }
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
                data: userPermissions
              };
        } catch (error) {
            logger.error(error?.message);
            console.log(
                `Error in RoleService - method getCurrentUserPermission() at ${new Date().getTime()} with message ${error?.message}`
            );
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Internal Server Error"
            }
        }
    }
    async getAllRoles(): Promise<IResponseBase> {   
       try {
            const roles = await this._context.RoleRepo
              .createQueryBuilder("role")
              .leftJoin("role.permissions", "permission")
              .leftJoin("permission.function", "function")
              .select([
                "role.id as id",
                "role.name as name",
                "role.description as description",
                'json_agg(function.id) as "functionId"',    
              ])
              .groupBy("role.id")
              .getRawMany();

          return {
            status: StatusCodes.OK,
            success:true,
            message:"Lấy danh sách vai trò thành công",
            data: roles         
          }

        } catch (error) {
            logger.error(error?.message);
          console.error(`Error in RoleService.getAllRoles at ${new Date().toISOString()}:`, error);

          return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Lỗi hệ thống",
          }
        }
    }
    async getAllFunctions(): Promise<IResponseBase> {
    try { 

      const functions = await this._context.FunctionRepo.find()

      return {
        status: StatusCodes.OK,
        success: false,
        message: "Lấy danh sách quyền thành công",
        data: functions,
      }

     } catch (error) {
         logger.error(error?.message);
         console.log(`Error in RoleService - method getAllRoles() at ${new Date().getTime()} with message ${error?.message}`)

          return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Lỗi hệ thống"
          }
     } 
    }  
    async updateRolePermissions(data: IUpdateRolePermission): Promise<IResponseBase> {
      try {
        const { roleId, functionIds } = data;

        const role = await this._context.RoleRepo.findOne({ where: { id: roleId } });
        if (!role) {
          return {
            status: StatusCodes.BAD_REQUEST,
            success: false,
            message: "Vai trò không tồn tại"  
          }
        }

        const currentPermissions = await this._context.PermissionRepo.find({
          where: { roleId },
          select: ["functionId"]
        })
        const currentFunctionIds = currentPermissions.map(p => p.functionId);

        const functionIdsToAdd = functionIds.filter(id => !currentFunctionIds.includes(id));
        const functionIdsToRemove = currentFunctionIds.filter(id => !functionIds.includes(id));

        const dataSource = this._context.getDataSource();
        await dataSource.transaction(async (manager) => {
          if (functionIdsToRemove.length > 0) {
            await manager.delete(Permission, {
              roleId,
              functionId: In(functionIdsToRemove),
            });
          }

          if (functionIdsToAdd.length > 0) {
            const newPermissions = functionIdsToAdd.map(fid => {
              const perm = new Permission();
              perm.roleId = roleId;
              perm.functionId = fid;
              return perm;
            });
            await manager.save(Permission, newPermissions);
          }
        })

         const updatedRole = await this.getRoleById(data.roleId)

          if(!updatedRole.success) {
            return {
              status: StatusCodes.BAD_REQUEST,
              success: false,
              message: "Cập nhật vai trò thất bại"
            }
          }

        return {
          status: StatusCodes.OK,
          success: true,
          message: "Cập nhật quyền thành công",
          data: updatedRole.data,
        };

        } catch (error) {
          logger.error(error?.message);
          console.log(`Error in RoleService - method updateRolePermissions() at ${new Date().getTime()} with message ${error?.message}`)
          return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Lỗi hệ thống"
          }
        }
    }
    async updateUserGroupRole(userId: number, groupRole: number[]): Promise<IResponseBase> {
    try {
      const user = await this._context.UserRepo.findOne({
        where: { id: userId }
      });

      if (!user) {
        return {
          status: StatusCodes.BAD_REQUEST,
          success: false,
          message: "Người dùng không tồn tại",
        }
      }



      return {
        status: StatusCodes.OK,
        success: true,
        message: "Cập nhật nhóm quyền thành công",
        data: user
      };

    } catch (error) {
      logger.error(error);
      console.log(`Error in RoleService - method updateUserGroupRole() at ${new Date().getTime()} with message ${error?.message}`)
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Lỗi hệ thống",
      }
     }
    }
}