import {IUserDto, IUserFilter } from "./user-dto"
import { IPaginationResponse } from "../base/IPaginationBase"

export default interface IUserService {
    getAllUsers(filter:IUserFilter): Promise<IPaginationResponse<IUserDto>>
    getUserById(userId: number): Promise<IUserDto>
    updateUser(data:any): Promise<IUserDto>
    deleteUser(userId: number): Promise<boolean>
}