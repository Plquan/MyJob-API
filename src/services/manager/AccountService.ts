import IAccountService from "@/interfaces/account/IAccountService";
import { IResponseBase } from "@/interfaces/base/IResponseBase";
import CloudinaryService from "../common/CloudinaryService";
import logger from "@/helpers/logger";
import { StatusCodes } from "http-status-codes";
import { ErrorMessages } from "@/constants/ErrorMessages";
import DatabaseService from "../common/DatabaseService";
import { RequestStorage } from "@/middlewares";
import { LocalStorage } from "@/constants/LocalStorage";
import { MyJobFile } from "@/entity/MyJobFile";
import { VariableSystem } from "@/constants/VariableSystem";
import { console } from "inspector";

export default class AccountService implements IAccountService {

    private readonly _context:DatabaseService
    constructor(DatabaseService:DatabaseService) {
        this._context = DatabaseService;
    }

    async updateAvatar(file: Express.Multer.File): Promise<IResponseBase> {
        try {
             const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
            const userId = request?.user.id;

           if (!userId) {
            return {
              status: 401,
              success: false,
              message: "Bạn không có quyền truy cập",
              data: null,
              error: {
                message: "Unauthorized",
                errorDetail: "Không tìm thấy Id người dùng",
              },
            };
          }
            const myJobFile = await this._context.MyJobFileRepo.findOne({
            where: {
                user: {
                id: userId,
                },
            },
            });
            const result = await CloudinaryService.uploadImage(file,VariableSystem.FileType.AVATAR,myJobFile?.publicId??undefined);
           
            const newFile = {
                userId,
                publicId: result.public_id,
                url: result.secure_url,
                fileType: VariableSystem.FileType.AVATAR
            } as MyJobFile;

            if (myJobFile) {
                 this._context.MyJobFileRepo.merge(myJobFile, newFile);
            }
               await this._context.MyJobFileRepo.save(myJobFile || newFile);

           
           return {
                status: StatusCodes.OK,
                success: true,
                message: "Cập nhật ảnh đại diện thành công",
                data:newFile.url,
                error: null
            };
           
        
        } catch (error) {
            logger.error(error?.message);
            console.log(
                `Error in Accountervice - method updateAvatar at ${new Date().getTime()} with message ${error?.message}`
            );
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
    
}