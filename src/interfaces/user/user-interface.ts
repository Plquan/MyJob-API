import { IResponseBase } from "../base/IResponseBase"
import { CreateUserRequest } from "../../dtos/user/create-user-request"
import { ICreateUser, IUserFilter } from "../../dtos/user/user-dto"

export default interface IUserService {
    getAllUsers(filter:IUserFilter): Promise<IResponseBase>
    getUserById(userId: number): Promise<IResponseBase>
    createUser(data: CreateUserRequest):Promise<IResponseBase>
    updateUser(data:any): Promise<IResponseBase>
    deleteUser(userId: number): Promise<IResponseBase>
}