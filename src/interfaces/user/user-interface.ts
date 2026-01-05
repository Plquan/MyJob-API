import { CreateUserRequest } from "../../dtos/user/create-user-request"
import { ICreateUser, IUserFilter, IUser } from "../../dtos/user/user-dto"
import { IPaginationResponse } from "../base/IPaginationBase"

export default interface IUserService {
    getAllUsers(filter:IUserFilter): Promise<IPaginationResponse<IUser>>
    getUserById(userId: number): Promise<IUser>
    updateUser(data:any): Promise<IUser>
    deleteUser(userId: number): Promise<boolean>
}