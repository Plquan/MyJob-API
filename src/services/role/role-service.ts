import IRoleService from "@/interfaces/role/role-interface";
import DatabaseService from "../common/database-service";
import logger from "@/common/helpers/logger";
import { ICreateRoleData, IUpdateRoleData, IUpdateRolePermission, IRoleDto, IRoleWithFunctions, IFunction } from "@/dtos/role/role-dto";
import { Permission } from "@/entities/permission";
import { In } from "typeorm";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { HttpException } from "@/errors/http-exception";
import { EAuthError } from "@/common/enums/error/EAuthError";
import { EGlobalError } from "@/common/enums/error/EGlobalError";

export default class RoleService implements IRoleService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }
  
    async getRoleById(roleId: number): Promise<IRoleWithFunctions> {
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
              throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Vai trò không tồn tại");
            }
            return role as IRoleWithFunctions;
       } catch (error) {
          logger.error(error?.message);
            console.error(`Error in RoleService.getRoleById at ${new Date().toISOString()}:`, error);
            throw error;
      }
    }
    async deleteRole(roleId: number): Promise<boolean> {
      try {
          const role = await this._context.RoleRepo.findOne({
            where: { id: roleId }})
          if(!role){
            throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Nhóm quyền không tồn tại");
          }
          const result = await this._context.RoleRepo.delete(roleId)

          if (result.affected === 0) {
            throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.OperationFailed, "Không thể xóa vai trò");
          }

          return true;
      } catch (error) {
          logger.error(error?.message);
              console.log(
                  `Error in RoleService - method deleteRole() at ${new Date().getTime()} with message ${error?.message}`
              );
              throw error;
      }
    }
    async updateRole(data: IUpdateRoleData): Promise<IRoleDto> {
      try {
        const role = await this._context.RoleRepo.findOne({
          where:{id:data.id}
        })
        if(!role){
          throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Vai trò không tồn tại");
        }

        this._context.RoleRepo.merge(role, data);
        const savedRole = await this._context.RoleRepo.save(role)

        return savedRole as IRoleDto;

      } catch (error) {
          logger.error(error?.message);
              console.log(
                  `Error in RoleService - method updateRole() at ${new Date().getTime()} with message ${error?.message}`
              );
              throw error;
      }
    }
    async createRole(data:ICreateRoleData): Promise<IRoleDto> {
      try {
        if(!data.name || data.name.trim() === "") {
            throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Tên vai trò không được để trống");
        }
        const existingRole = await this._context.RoleRepo.findOne({
            where: { name: data.name }
        })

        if(existingRole){
          throw new HttpException(StatusCodes.CONFLICT, EGlobalError.ConflictError, "Nhóm quyền đã tồn tại");
        }
        const newRole = this._context.RoleRepo.create(data)
        const savedRole = await this._context.RoleRepo.save(newRole)

        return savedRole as IRoleDto;
      } catch (error) {
          logger.error(error?.message);
            console.log(
                `Error in RoleService - method createRole() at ${new Date().getTime()} with message ${error?.message}`
            );
            throw error;
      }
    }
    async getCurrentUserPermission(userId: number): Promise<string[]> {
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
              "function.name",
            ])
            .getMany();
            return userPermissions.map(f => f.name);
        } catch (error) {
            logger.error(error?.message);
            console.log(
                `Error in RoleService - method getCurrentUserPermission() at ${new Date().getTime()} with message ${error?.message}`
            );
            throw error;
        }
    }
    async getAllRoles(): Promise<IRoleDto[]> {   
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

          return roles as IRoleDto[];

        } catch (error) {
            logger.error(error?.message);
          console.error(`Error in RoleService.getAllRoles at ${new Date().toISOString()}:`, error);
          throw error;
        }
    }
    async getAllFunctions(): Promise<IFunction[]> {
    try { 

      const functions = await this._context.FunctionRepo.find()

      return functions as IFunction[];

     } catch (error) {
         logger.error(error?.message);
         console.log(`Error in RoleService - method getAllFunctions() at ${new Date().getTime()} with message ${error?.message}`)
         throw error;
     } 
    }  
    async updateRolePermissions(data: IUpdateRolePermission): Promise<boolean> {
      try {
        const { roleId, functionIds } = data;

        const role = await this._context.RoleRepo.findOne({ where: { id: roleId } });
        if (!role) {
          throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Vai trò không tồn tại");
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

        return true;

        } catch (error) {
          logger.error(error?.message);
          console.log(`Error in RoleService - method updateRolePermissions() at ${new Date().getTime()} with message ${error?.message}`)
          throw error;
        }
    }
    async updateUserGroupRole(userId: number, groupRole: number[]): Promise<boolean> {
    try {
      const user = await this._context.UserRepo.findOne({
        where: { id: userId }
      });

      if (!user) {
        throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Người dùng không tồn tại");
      }

      // Note: Logic to update group roles should be implemented here
      // For now, just return true if user exists
      return true;

    } catch (error) {
      logger.error(error);
      console.log(`Error in RoleService - method updateUserGroupRole() at ${new Date().getTime()} with message ${error?.message}`)
      throw error;
     }
    }
}