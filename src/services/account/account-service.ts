import IAccountService from "@/interfaces/account/account-interface";
import CloudinaryService from "../common/cloudinary-service";
import { IMyJobFileDto } from "@/interfaces/myjobfile/myjobfile-dto";
import { HttpException } from "@/errors/http-exception";
import { EAuthError } from "@/common/enums/error/EAuthError";
import { EGlobalError } from "@/common/enums/error/EGlobalError";
import logger from "@/common/helpers/logger";
import DatabaseService from "../common/database-service";
import { LocalStorage } from "@/common/constants/local-storage";
import { VariableSystem } from "@/common/constants/VariableSystem";
import { console } from "inspector";
import { CloudinaryResourceType } from "@/common/constants/cloudinary-resource-type";
import { RequestStorage } from "@/common/middlewares/async-local-storage";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";

export default class AccountService implements IAccountService {

    private readonly _context:DatabaseService

    constructor(DatabaseService:DatabaseService) {
        this._context = DatabaseService;
    }

    async updateAvatar(file: Express.Multer.File): Promise<IMyJobFileDto> {
        try {
            const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
            const userId = request?.user.id;

           if (!userId) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
          }

            // Lấy candidate từ userId
            const candidate = await this._context.CandidateRepo.findOne({
                where: { userId },
                relations: ['avatar']
            });

            if (!candidate) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy thông tin ứng viên");
            }

            const myJobFile = candidate.avatar;

            const result = await CloudinaryService.uploadFile(
                file,
                VariableSystem.FolderType.AVATAR,
                CloudinaryResourceType.IMAGE,
                myJobFile?.publicId??undefined
            )      
            const newFile = {
                publicId: result.public_id,
                url: result.secure_url,
                fileType: VariableSystem.FolderType.AVATAR,
                resourceType: result.resource_type,
                format: result.format
            }

           const savedFile = await this._context.MyJobFileRepo.save(
            myJobFile ? this._context.MyJobFileRepo.merge(myJobFile, newFile) : newFile
            )

            await this._context.CandidateRepo.update(
            { id: candidate.id },
            { avatar: savedFile }
            )

           return savedFile as IMyJobFileDto;
           
        } catch (error) {
            logger.error(error?.message);
            console.log(
                `Error in AccountService - method updateAvatar at ${new Date().getTime()} with message ${error?.message}`
            )
            throw error;
        }
    }
    
}