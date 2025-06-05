import { IResponseBase } from "@/interfaces/base/IResponseBase";
import IUserService from "@/interfaces/user/IUserService";
import DatabaseService from "../common/DatabaseService";
import logger from "@/helpers/logger";
import { StatusCodes } from "http-status-codes";
import { ErrorMessages } from "@/constants/ErrorMessages";

export default class UserService implements IUserService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService;
    }
    async getAllUsers(): Promise<IResponseBase> {
       try {
            const users = await this._context.UserRepo.createQueryBuilder("user")
            .leftJoin("user.avatar", "avatar")
            .select([
                'user.id AS "id"',
                'user.email AS "email"',
                'user.fullName AS "fullName"',
                'user.isVerifyEmail AS "isVerifyEmail"',
                'user.isActive AS "isActive"',
                'user.isSuperUser AS "isSuperUser"',     
                'user.isStaff AS "isStaff"',       
                'user.roleName AS "roleName"',
                'user.createdAt AS "createdAt"',
                'user.updatedAt AS "updatedAt"',
                'user.avatarId AS "avatarId"',
                'avatar.url AS "avatar"',
            ])
            .getRawMany();
            return {
                status: 200,
                success: true,
                message: "Lấy danh sách người dùng thành công",
                data: users,
            };
       } catch (error) {
         logger.error(error?.message);
            console.log(`Error in UserService - method getAllUsers() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: ErrorMessages.INTERNAL_SERVER_ERROR,
                data: null,
                error: {
                message: ErrorMessages.INTERNAL_SERVER_ERROR,
                errorDetail: error.message,
            },
            };
       }
    }  
    async getUserById(userId: number): Promise<IResponseBase> {
        try {
           const user = await this._context.UserRepo.createQueryBuilder("user")
                .leftJoin("user.avatar", "myJobFile")
                .leftJoin("user.groupRole", "groupRole")
                .leftJoin("groupRole.role", "role")
                .select([
                    'user.id AS "id"',
                    'user.email AS "email"',
                    'user.fullName AS "fullName"',
                    'user.isVerifyEmail AS "isVerifyEmail"',
                    'user.isActive AS "isActive"',
                    'user.isDeleted AS "isDeleted"',
                    'user.isSuperUser AS "isSuperUser"',     
                    'user.isStaff AS "isStaff"',       
                    'user.roleName AS "roleName"',
                    'user.createdAt AS "createdAt"',
                    'user.updatedAt AS "updatedAt"',
                    'user.avatarId AS "avatarId"',
                    'myJobFile.url AS "avatar"',
                    'json_agg(role.name) AS "groupRoles"',
                ])
                .where("user.id = :id", { id: userId })
                .groupBy('user.id')
                .addGroupBy('myJobFile.url')
                .getRawOne();


            return {
                status: 200,
                success: true,
                message: "Lấy danh sách người dùng thành công",
                data: user,
            };

        } catch (error) {
            logger.error(error?.message);
            console.log(`Error in UserService - method getUserById() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: ErrorMessages.INTERNAL_SERVER_ERROR,
                data: null,
                error: {
                message: ErrorMessages.INTERNAL_SERVER_ERROR,
                errorDetail: error.message,
            },
            };
        }
    }
    createUser(data: any): Promise<IResponseBase> {
        throw new Error("Method not implemented.");
    }
    updateUser(data: any): Promise<IResponseBase> {
        throw new Error("Method not implemented.");
    }
    deleteUser(userId: number): Promise<IResponseBase> {
        throw new Error("Method not implemented.");
    }
}