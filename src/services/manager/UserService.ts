import { IResponseBase } from "@/interfaces/base/IResponseBase";
import IUserService from "@/interfaces/user/IUserService";
import DatabaseService from "../common/DatabaseService";
import logger from "@/helpers/logger";
import { StatusCodes } from "http-status-codes";
import { ErrorMessages } from "@/constants/ErrorMessages";
import { ICreateUser, IUpdateUser, IUserFilter } from "@/interfaces/user/UserDto";
import Extensions from "@/ultils/Extensions";
import { User } from "@/entity/User";
import { SelectQueryBuilder } from "typeorm";
import IRoleService from "@/interfaces/role/IRoleService";
import { GroupRole } from "@/entity/GroupRole";

export default class UserService implements IUserService {
    private readonly _context: DatabaseService
    private readonly _roleSerive: IRoleService;

    constructor(DatabaseService: DatabaseService, RoleService: IRoleService) {
        this._context = DatabaseService
        this._roleSerive = RoleService;
    }

    async getAllUsers(filter:IUserFilter): Promise<IResponseBase> {
       try {
            const {
                   page = 1, 
                   limit = 10
                } = filter;

            let query = await this._context.UserRepo.createQueryBuilder("user")
            .leftJoin("user.avatar", "avatar")
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
                'json_agg(role.id) AS "groupRoles"',
            ])
            .groupBy('user.id')
            .addGroupBy('avatar.url')
            
            let countQuery = this._context.UserRepo.createQueryBuilder("user")
            .leftJoin("user.avatar", "avatar")
            .leftJoin("user.groupRole", "groupRole")
            .leftJoin("groupRole.role", "role");

            query = this.applyUserFilters(query, filter);
            countQuery = this.applyUserFilters(countQuery, filter);

           const totalItem = await countQuery.getCount();

            query.skip((page - 1) * limit).take(limit);

            const users = await query.getRawMany();

            return {
                status: 200,
                success: true,
                message: "Lấy danh sách người dùng thành công",
                data: {
                    users,
                    page,
                    limit,
                    totalItem
                },
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

    async getUserById(userId: number): Promise<IResponseBase> {
        try {
           const user = await this._context.UserRepo.createQueryBuilder("user")
                .leftJoin("user.avatar", "avatar")
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

            return {
                status: 200,
                success: true,
                message: "Lấy người dùng thành công",
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

    async createUser(data: ICreateUser): Promise<IResponseBase> {
        try {
           if(!data.fullName || !data.email || !data.password || !data.roleName) {
                return {
                    status: StatusCodes.BAD_REQUEST,
                    success: false,
                    message: "Thông tin người dùng không hợp lệ",
                    data: null,
                    error: {
                        message: "Invalid user information",
                        errorDetail: "Full name, email, password and role name are required"
                    }
                }
           }
            const existingUser = await this._context.UserRepo.findOne({
                where: { email: data.email }
            })
            
            if(existingUser){
                return {
                    status: StatusCodes.CONFLICT,
                    success: false,
                    message: "Người dùng đã tồn tại",
                    data: null,
                    error: {
                        message: "User already exists",
                        errorDetail: "A user with this email already exists"
                    }
                }
            }

            const hashPassword = Extensions.hashPassword(data.password);

             const newUserData = {
                email: data.email,
                fullName: data.fullName,
                password:hashPassword,
                isVerifyEmail: data.isVerifyEmail,
                isActive: data.isActive,
                roleName: data.roleName,
                isSuperUser: data.isSuperUser,
                isStaff: data.isStaff,
            } as ICreateUser;

            const newUser = await this._context.UserRepo.create(newUserData)
            await this._context.UserRepo.save(newUser);
            delete  newUser.password;

             return {
                    status: StatusCodes.CREATED,
                    success: true,
                    message: "Thêm người dùng mới thành công",
                    data: newUser,
                }
        } catch (error) {
              logger.error(error?.message);
            console.log(`Error in UserService - method createUser() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: ErrorMessages.INTERNAL_SERVER_ERROR,
                data: null,
                error: {
                message: ErrorMessages.INTERNAL_SERVER_ERROR,
                errorDetail: error.message,
            }
            }
        }
    }

    async updateUser(data: IUpdateUser): Promise<IResponseBase> {

      const dataSource = this._context.getDataSource();

        try {
             await dataSource.transaction(async (manager) => {
                const userRepo = manager.getRepository(User);
                const groupRoleRepo = manager.getRepository(GroupRole);

                const user = await userRepo.findOne({ where: { id: data.id } });

                if (!user) {
                    throw {
                        status: StatusCodes.NOT_FOUND,
                        success: false,
                        message: "Người dùng không tồn tại",
                        error: {
                            message: "User not found",
                            errorDetail: "User not found"
                        }
                    }
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
                if(!updatedUser.success || !updatedUser.data) {
                return {
                    status: StatusCodes.INTERNAL_SERVER_ERROR,
                    success: false,
                    message: "Không tìm thấy thông tin người dùng hoặc người dùng đã bị xoá",
                    data: null,
                    error: {
                        message: ErrorMessages.INTERNAL_SERVER_ERROR,
                        errorDetail: "Không tìm thấy thông tin người dùng hoặc người dùng đã bị xoá",
                    }
                }
                }
            return {
                status: StatusCodes.OK,
                success: true,
                message: "Cập nhật thông tin người dùng thành công",
                data: updatedUser.data
            };

        } catch (error) {
            logger.error(error?.message);
            console.log(`Error in UserService - method updateUser() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: ErrorMessages.INTERNAL_SERVER_ERROR,
                data: null,
                error: {
                message: ErrorMessages.INTERNAL_SERVER_ERROR,
                errorDetail: error.message,
            },
            }
        }
    }
    
    async deleteUser(userId: number): Promise<IResponseBase> {
      try {
          const user = await this._context.UserRepo.findOne({
        where: {
          id: userId,
        },
      });
      if (!user) {
        return {
          status: StatusCodes.NOT_FOUND,
          success: false,
          message: "Không tìm thấy thông tin người dùng",
          data: null,
          error: {
            message: ErrorMessages.NOT_FOUND,
            errorDetail: "Không tìm thấy thông tin người dùng hoặc người dùng đã bị xoá",
          },
        };
      }
      const result = await this._context.UserRepo.delete(userId);
          if (result.affected === 0) {
            return {
              status: StatusCodes.BAD_REQUEST,
              success: false,
              message: "Không thể xóa người",
              data: null,
              error: {
                message: "Không thể xóa",
                errorDetail: "Không có người dùng nào bị xóa",
              }
            };
          }

       return {
        status: StatusCodes.OK,
        success: true,
        message: "Xoá người dùng thành công",
        data:userId
      };
      } catch (error) {
        logger.error(error?.message);
        console.log(`Error in UserService - method deleteUser() at ${new Date().getTime()} with message ${error?.message}`);
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: ErrorMessages.INTERNAL_SERVER_ERROR,
                data: null,
                error: {
                message: ErrorMessages.INTERNAL_SERVER_ERROR,
                errorDetail: error.message,
            },
            }
      }
    }
}