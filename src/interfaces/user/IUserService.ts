import { IResponseBase } from "../base/IResponseBase"
import { ICreateUser, IUserFilter } from "./UserDto"

export default interface IUserService {
    getAllUsers(filter:IUserFilter): Promise<IResponseBase>
    getUserById(userId: number): Promise<IResponseBase>
    createUser(data: ICreateUser):Promise<IResponseBase>
    updateUser(data:any): Promise<IResponseBase>
    deleteUser(userId: number): Promise<IResponseBase>
}