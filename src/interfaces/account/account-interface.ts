import { IMyJobFileDto } from "../myjobfile/myjobfile-dto";

export default interface IAccountService { 
    updateAvatar(file: Express.Multer.File): Promise<IMyJobFileDto>;
}
