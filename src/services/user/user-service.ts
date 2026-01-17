import IUserService from "@/interfaces/user/user-interface";
import DatabaseService from "../common/database-service";
import { IUserFilter, IUpdateUser, IUserDto } from "@/interfaces/user/user-dto";
import { User } from "@/entities/user";
import { SelectQueryBuilder } from "typeorm";
import IRoleService from "@/interfaces/role/role-interface";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { IPaginationResponse } from "@/interfaces/base/IPaginationBase";
import { HttpException } from "@/errors/http-exception";
import { EGlobalError } from "@/common/enums/error/EGlobalError";
import { GroupRole } from "@/entities/group-role";

export default class UserService implements IUserService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
    }

    async getAllUsers(filter: IUserFilter): Promise<IPaginationResponse<IUserDto>> {
        try {
            const {
                page = 1,
                limit = 10
            } = filter;

            let query = this._context.UserRepo.createQueryBuilder("user")
                .leftJoin("user.candidate", "candidate")
                .leftJoin("candidate.avatar", "avatar")
                .leftJoin("user.groupRole", "groupRole")
                .leftJoin("groupRole.role", "role")
                .select([
                    'user.id AS "id"',
                    'user.email AS "email"',
                    'user.isVerifyEmail AS "isVerifyEmail"',
                    'user.isActive AS "isActive"',
                    'user.isSuperUser AS "isSuperUser"',
                    'user.isStaff AS "isStaff"',
                    'user.roleName AS "roleName"',
                    'user.createdAt AS "createdAt"',
                    'user.updatedAt AS "updatedAt"',
                    'avatar.url AS "avatar"',
                    'json_agg(role.id) AS "groupRoles"',
                ])
                .groupBy('user.id')
                .addGroupBy('avatar.url')

            let countQuery = this._context.UserRepo.createQueryBuilder("user")
                .leftJoin("user.candidate", "candidate")
                .leftJoin("candidate.avatar", "avatar")
                .leftJoin("user.groupRole", "groupRole")
                .leftJoin("groupRole.role", "role");

            query = this.applyUserFilters(query, filter);
            countQuery = this.applyUserFilters(countQuery, filter);

            const totalItems = await countQuery.getCount();
            const totalPages = Math.ceil(totalItems / limit);

            query.skip((page - 1) * limit).take(limit);

            const users = await query.getRawMany();

            return {
                items: users,
                totalPages,
                totalItems
            };
        } catch (error) {
            throw error;
        }
    }

    async updateUser(data: IUpdateUser): Promise<IUserDto> {
        const dataSource = this._context.getDataSource();
        try {
            await dataSource.transaction(async (manager) => {
                const userRepo = manager.getRepository(User);
                const groupRoleRepo = manager.getRepository(GroupRole);

                const user = await userRepo.findOne({ where: { id: data.id } });

                if (!user) {
                    throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Người dùng không tồn tại");
                }

                const updateUserData = {
                    email: data.email,
                    fullName: data.fullName,
                    isVerifyEmail: data.isVerifyEmail,
                    isActive: data.isActive,
                    isSuperUser: data.isSuperUser,
                    isStaff: data.isStaff,
                    ...(data.password && { password: data.password })
                };

                userRepo.merge(user, updateUserData);
                await userRepo.save(user);

                await groupRoleRepo.delete({ userId: data.id });

                if (data.groupRoles?.length > 0) {
                    const newGroupRoles = data.groupRoles.map(roleId => ({
                        userId: data.id,
                        roleId
                    }))
                    await groupRoleRepo.save(newGroupRoles);
                }
            })
            const updatedUser = await this.getUserById(data.id)
            return updatedUser;

        } catch (error) {
            throw error;
        }
    }

    private applyUserFilters(query: SelectQueryBuilder<User>, filter: IUserFilter): SelectQueryBuilder<User> {
        const { searchKey, roleName, isActive, isVerifyEmail } = filter;

        if (searchKey) {
            query.andWhere('(LOWER(user.email) LIKE :searchKey OR LOWER(user.fullName) LIKE :searchKey)', {
                searchKey: `%${searchKey.toLowerCase()}%`,
            });
        }

        if (roleName) {
            query.andWhere('user.roleName = :roleName', { roleName });
        }

        if (isActive !== undefined) {
            query.andWhere('user.isActive = :isActive', { isActive });
        }

        if (isVerifyEmail !== undefined) {
            query.andWhere('user.isVerifyEmail = :isVerifyEmail', { isVerifyEmail });
        }

        return query;
    }

    async getUserById(userId: number): Promise<IUserDto> {
        try {
            const user = await this._context.UserRepo.createQueryBuilder("user")
                .leftJoin("user.candidate", "candidate")
                .leftJoin("candidate.avatar", "avatar")
                .leftJoin("user.groupRole", "groupRole")
                .leftJoin("groupRole.role", "role")
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
                    'avatar.url AS "avatar"',
                    'json_agg(role.name) AS "groupRoles"',
                ])
                .where("user.id = :id", { id: userId })
                .groupBy('user.id')
                .addGroupBy('avatar.url')
                .getRawOne();

            if (!user) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy người dùng");
            }

            return user as IUserDto;

        } catch (error) {
            throw error;
        }
    }

    async deleteUser(userId: number): Promise<boolean> {
        try {
            const user = await this._context.UserRepo.findOne({
                where: {
                    id: userId,
                },
            })
            if (!user) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy thông tin người dùng");
            }
            await this._context.UserRepo.remove(user);

            return true;
        } catch (error) {
            throw error;
        }
    }
}