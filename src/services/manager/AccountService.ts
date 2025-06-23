import IAccountService from "@/interfaces/account/IAccountService";
import { IResponseBase } from "@/interfaces/base/IResponseBase";
import CloudinaryService from "../common/CloudinaryService";
import logger from "@/helpers/logger";
import { StatusCodes } from "http-status-codes";
import DatabaseService from "../common/DatabaseService";
import { RequestStorage } from "@/middlewares";
import { LocalStorage } from "@/constants/LocalStorage";
import { MyJobFile } from "@/entity/MyJobFile";
import { VariableSystem } from "@/constants/VariableSystem";
import { console } from "inspector";
import { CloudinaryResourceType } from "@/constants/CloudinaryResourceType";

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
              status: StatusCodes.UNAUTHORIZED,
              success: false,
              message: "Bạn không có quyền truy cập"
            }
          }
            const myJobFile = await this._context.MyJobFileRepo.findOne({
            where: {
                user: {
                id: userId,
                },
            },
            })
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
            }

           const savedFile = await this._context.MyJobFileRepo.save(
            myJobFile ? this._context.MyJobFileRepo.merge(myJobFile, newFile) : newFile
            )

            await this._context.UserRepo.update(
            { id: userId },
            { avatar: savedFile }
            )

           return {
                status: StatusCodes.OK,
                success: true,
                message: "Cập nhật ảnh đại diện thành công",
                data:newFile.url,
            }
           
        } catch (error) {
            logger.error(error?.message);
            console.log(
                `Error in AccountService - method updateAvatar at ${new Date().getTime()} with message ${error?.message}`
            )
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi khi cập nhật ảnh đại diện, vui lòng thử lại sau",
            }
        }
    }
    
}