import { IResponseBase } from "../base/IResponseBase"

export default interface IUserService {
    getAllUsers(): Promise<IResponseBase>
    getUserById(userId: number): Promise<IResponseBase>
    createUser(data: any):Promise<IResponseBase>
    updateUser(data:any): Promise<IResponseBase>
    deleteUser(userId: number): Promise<IResponseBase>
}