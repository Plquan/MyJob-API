import ILanguageService from "@/interfaces/language/language-interface";
import DatabaseService from "../common/database-service";
import { LocalStorage } from "@/common/constants/local-storage";
import logger from "@/common/helpers/logger";
import { RequestStorage } from "@/common/middlewares/async-local-storage";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { EResumeType } from "@/common/enums/resume/resume-enum";
import { ICreateLanguageData, IUpdateLanguageData, ILanguageDto } from "@/dtos/language/language-dto";
import { HttpException } from "@/errors/http-exception";
import { EAuthError } from "@/common/enums/error/EAuthError";
import { EGlobalError } from "@/common/enums/error/EGlobalError";

export default class LanguageService implements ILanguageService {

    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }

    async getAllLanguages(): Promise<ILanguageDto[]> {
        try {
          const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE)
          const userId = request?.user?.id

          if (!userId) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
          } 

          const languages = await this._context.LanguageRepo.find({
            where:{resume:{ candidate:{ userId } }},
            order: { createdAt: 'DESC' }
          })

          return languages as ILanguageDto[];
        } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in LanguageService - method getAllLanguages() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            throw error;
        }
    }
    async createLanguage(data: ICreateLanguageData): Promise<ILanguageDto> {
        try {
          const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
          const userId = request?.user?.id;

          if (!userId) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
          } 

          if(!data.language || !data.level){
            throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Vui lòng kiểm tra lại dữ liệu của bạn");
          }
           
          const onlineResume = await this._context.ResumeRepo.findOne({
            where: {
              type: EResumeType.ONLINE,
              candidate: { userId },
            }
          })

          if(!onlineResume){
            throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy hồ sơ online của bạn");
          }

          data.resumeId = onlineResume.id
          
          const newLanguage = this._context.LanguageRepo.create(data)
          const savedLanguage = await this._context.LanguageRepo.save(newLanguage)

          return savedLanguage as ILanguageDto;

        } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in LanguageService - method createLanguage() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            throw error;
        }
    }
    async updateLanguage(data: IUpdateLanguageData): Promise<ILanguageDto> {
         try {
          const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
          const userId = request?.user?.id;

          if (!userId) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
          } 

          if(!data.language || !data.level || !data.id){
            throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Vui lòng kiểm tra lại dữ liệu của bạn");
          }

          const language = await this._context.LanguageRepo.findOne({
            where:{id: data.id}
          })

          if(!language){
            throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy ngôn ngữ");
          }
          
          this._context.LanguageRepo.merge(language,data)
          const updatedLanguage = await this._context.LanguageRepo.save(language)

          return updatedLanguage as ILanguageDto;

        } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in LanguageService - method updateLanguage() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            throw error;
        }
    }
    async deleteLanguage(languageId: number): Promise<boolean> {
         try {
            
          if(!languageId){
            throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Vui lòng kiểm tra lại dữ liệu của bạn");
          }

         const language = await this._context.LanguageRepo.findOne({
            where:{id: languageId}
          })

          if(!language){
            throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy ngôn ngữ");
          }

          const result = await this._context.LanguageRepo.delete({id: languageId})

          return result.affected > 0;
        } catch (error) {
          logger.error(error?.message);
          console.error(
              `Error in LanguageService - method deleteLanguage() at ${new Date().toISOString()} with message: ${error?.message}`
          )
          throw error;
        }
    }

}