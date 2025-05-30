import IRoleService from "@/interfaces/auth/IRoleService";
import { IResponseBase } from "@/interfaces/base/IResponseBase";
import DatabaseService from "../common/DatabaseService";
import { StatusCodes } from "http-status-codes";
import logger from "@/helpers/logger";
import { Functions } from "@/constants/Functions";

export default class RoleService implements IRoleService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }

    getUserRoles(roleId: string): Promise<IResponseBase> {
        throw new Error("Method not implemented.");
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
            };
        }
    }
    async getGroupRole(roleName: string): Promise<IResponseBase> {
        try {
            const groupRole = await this._context.GroupRoleRepo.find()
              if (!groupRole) {
                return {
                  status: StatusCodes.NOT_FOUND,
                  success: false,
                  message: "Không tìm thấy nhóm quyền",
                  data: null,
                  error: {
                    message: "Không tìm thấy",
                    errorDetail: "Không tìm thấy nhóm quyền",
                  },
                }
              }
              return {
                status: StatusCodes.OK,
                success: true,
                data: groupRole,
                error: null,
              }
              
        } catch (error) {
            logger.error(error?.message);
            console.log(`Error in AuthService - method getGroupRole at ${new Date().getTime()} with message ${error?.message}`);
      
            return {
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              success: false,
              message: "Internal Server Error",
              data: null,
              error: {
                message: "Internal Server Error",
                errorDetail: "Internal Server Error",
              }
            }
        }
    }

    async getAllGroupRoles(): Promise<IResponseBase> {   
    try {
       const roles = await this._context.GroupRoleRepo
        .createQueryBuilder('role')
        .leftJoin('role.permissions', 'permission')
        .leftJoin('permission.function', 'function', 'function.isDeleted = false')
        .where('role.isDeleted = false')
        .select([
          'role.id AS id',
          'role.name AS name',
          'role.displayName AS displayName',
          'json_agg(DISTINCT function.name) AS functionNames',
        ])
        .groupBy('role.id, role.name, role.displayName')
        .getRawMany();

          return {
            status: StatusCodes.ACCEPTED,
            success:true,
            message:"Lấy danh sách vai trò thành công",
            data: roles         
          }

        } catch (error) {
           logger.error(error?.message);
            console.log(
                `Error in AuthService - method getAllGroupRoles() at ${new Date().getTime()} with message ${error?.message}`
            );
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: error.message,
                data: null,
                error: {
                message: "Internal Server Error",
                errorDetail: "Internal Server Error",
                },
            };
        }
    }

    async getAllFunctions(): Promise<IResponseBase> {
    try { 
      return {
        status: StatusCodes.ACCEPTED,
        success: false,
        message: "Lấy danh sách quyền thành công",
        data: Functions,
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
}