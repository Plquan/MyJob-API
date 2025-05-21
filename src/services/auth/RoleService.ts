import IRoleService from "@/interfaces/auth/IRoleService";
import { IResponseBase } from "@/interfaces/base/IResponseBase";
import DatabaseService from "../database/DatabaseService";
import { StatusCodes } from "http-status-codes";
import logger from "@/helpers/logger";
import { permission } from "process";

export default class RoleService implements IRoleService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }


    getUserRoles(roleId: string): Promise<IResponseBase> {
        throw new Error("Method not implemented.");
    }
   async getCurrentUserPermission(roleId: number): Promise<IResponseBase> {
        try {
            const userPerMissions = await this._context.FunctionRepo.createQueryBuilder("function")
            .innerJoin("function.permissions", "permission")
            .where("permission.groupRoleId = :roleId", { roleId })
            .andWhere("permission.isDeleted = :isDeleted", { isDeleted: false })
            .andWhere("permission.isActive = :isActive", { isActive: true })
            .andWhere("function.isActive = :isActive", { isActive: true })
            .andWhere("function.isDeleted = :isDeleted", { isDeleted: false })
            .select(["function.id", "function.name", "function.functionLink"])
            .getMany();

            return {
                status: StatusCodes.OK,
                success: true,
                data: userPerMissions,
                error: null,
              };
        } catch (error) {
            logger.error(error?.message);
            console.log(
                `Error in AuthService - method getCurrentUserPermission() at ${new Date().getTime()} with message ${error?.message}`
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
            const groupRole = await this._context.GroupRoleRepo.findOne({
                where: {
                 name: roleName
                }
              })
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

    getAllGroupRoles(): Promise<IResponseBase> {
        throw new Error("Method not implemented.");
    }
    
}