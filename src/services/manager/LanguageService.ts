import { IResponseBase } from "@/interfaces/base/IResponseBase";
import ILanguageService from "@/interfaces/language/ILanguageService";
import { ICreateLanguageData, IUpdateLanguageData } from "@/interfaces/language/LanguageDto";
import DatabaseService from "../common/DatabaseService";
import { LocalStorage } from "@/constants/LocalStorage";
import logger from "@/helpers/logger";
import { RequestStorage } from "@/middlewares";
import { StatusCodes } from "http-status-codes";
import { VariableSystem } from "@/constants/VariableSystem";

export default class LanguageService implements ILanguageService {

    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }

    async getAllLanguages(): Promise<IResponseBase> {
        try {
          const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE)
          const userId = request?.user?.id

          if (!userId) {
            return {
              status: StatusCodes.UNAUTHORIZED,
              success: false,
              message: "Bạn không có quyền truy cập"
            }
          } 

          const languages = await this._context.LanguageRepo.find({
            where:{resume:{ candidate:{ userId } }},
            order: { createdAt: 'DESC' }
          })

           return {
              status: StatusCodes.OK,
              message:"Lấy danh sách ngôn ngữ thành công",
              success: true,
              data: languages         
            }
          } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in LanguageService - method getAllLanguages() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi khi lấy danh sách ngôn ngữ, vui lòng thử lại sau",
            }
        }
    }
    async createLanguage(data: ICreateLanguageData): Promise<IResponseBase> {
        try {
          const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
          const userId = request?.user?.id;

          if (!userId) {
            return {
              status: StatusCodes.UNAUTHORIZED,
              success: false,
              message: "Bạn không có quyền truy cập",
            }
          } 

          if(!data.language || !data.level){
            return {
                message: "Vui lòng kiểm tra lại dữ liệu của bạn",
                success: false,
                status: StatusCodes.BAD_REQUEST,
            }
          }
           
          const onlineResume = await this._context.ResumeRepo.findOne({
            where: {
              type: VariableSystem.CV_TYPE.CV_ONLINE,
              candidate: { userId },
            }
          })

          if(!onlineResume){
            return {
              status: StatusCodes.NOT_FOUND,
              success: false,
              message: "Không tìm thấy hồ sơ online của bạn",
            }
          }

          data.resumeId = onlineResume.id
          
          const newLanguage = this._context.LanguageRepo.create(data)
          await this._context.ExperienceRepo.save(newLanguage)

           return {
              status: StatusCodes.CREATED,
              message:"Thêm ngôn ngữ thành công",
              success: true,
              data: newLanguage         
            }

        } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in LanguageService - method createLanguage() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi thêm ngôn ngữ, vui lòng thử lại sau",
            }
        }
    }
    async updateLanguage(data: IUpdateLanguageData): Promise<IResponseBase> {
         try {
          const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
          const userId = request?.user?.id;

          if (!userId) {
            return {
              status: StatusCodes.UNAUTHORIZED,
              success: false,
              message: "Bạn không có quyền truy cập",
            }
          } 

          if(!data.language || !data.level || !data.id){
            return {
                message: "Vui lòng kiểm tra lại dữ liệu của bạn",
                success: false,
                status: StatusCodes.BAD_REQUEST,
            }
          }

          const experience = await this._context.ExperienceRepo.findOne({
            where:{id: data.id}
          })

          if(!experience){
             return{
                status: StatusCodes.NOT_FOUND,
                success:false,
                message: "Không tìm thấy kinh nghiệm"
             }
          }
          
          this._context.ExperienceRepo.merge(experience,data)
          await this._context.ExperienceRepo.save(experience)

        return {
            status: StatusCodes.CREATED,
            message:"cập nhật kinh nghiệm thành công",
            success: true,
            data: experience         
        }

        } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in ExperienceService - method updateExperience() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi cập nhật kinh nghiệm, vui lòng thử lại sau",
            }
        }
    }
    async deleteLanguage(languageId: number): Promise<IResponseBase> {
         try {
            
          if(!languageId){
            return {
                message: "Vui lòng kiểm tra lại dữ liệu của bạn",
                success: false,
                status: StatusCodes.BAD_REQUEST,
            }
          }

         const language = await this._context.LanguageRepo.findOne({
            where:{id: languageId}
          })

          if(!language){
             return{
                status: StatusCodes.NOT_FOUND,
                success:false,
                message: "Không tìm thấy ngôn ngữ"
             }
          }

          await this._context.LanguageRepo.delete({id: languageId})

          return {
            status:StatusCodes.OK,
            message:"Xóa ngôn ngữ thành công",
            success: true,
            data: languageId
          }        
        } catch (error) {
          logger.error(error?.message);
          console.error(
              `Error in LanguageService - method deleteLanguage() at ${new Date().toISOString()} with message: ${error?.message}`
          )
          return {
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              success: false,
              message: "Lỗi xóa ngôn ngữ, vui lòng thử lại sau",
          }
        }
    }

}