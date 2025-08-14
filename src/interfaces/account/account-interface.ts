import { IResponseBase } from "../base/IResponseBase";

export default interface IAccountService { 
    updateAvatar(file: Express.Multer.File): Promise<IResponseBase>;
}
