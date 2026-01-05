import { ICreateExperienceData, IUpdateExperienceData, IExperienceDto } from "@/dtos/experience/experience-dto";
import IExperienceService from "@/interfaces/experience/experience-interface";
import DatabaseService from "../common/database-service";
import { LocalStorage } from "@/common/constants/local-storage";
import logger from "@/common/helpers/logger";
import { RequestStorage } from "@/common/middlewares/async-local-storage";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { EResumeType } from "@/common/enums/resume/resume-enum";
import { HttpException } from "@/errors/http-exception";
import { EAuthError } from "@/common/enums/error/EAuthError";
import { EGlobalError } from "@/common/enums/error/EGlobalError";

export default class ExperienceService implements IExperienceService {

    private readonly _context:DatabaseService

    constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }
    
    async getAllExperiences(): Promise<IExperienceDto[]> {
       try {
          const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
          const userId = request?.user?.id;

          if (!userId) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
          } 

          const experiences = await this._context.ExperienceRepo.find({
            where:{resume:{ candidate:{ userId } }},
            order: { createdAt: 'DESC' }
          })

          return experiences as IExperienceDto[];
        } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in ExperienceService - method getAllExperiences() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            throw error;
        }
    }
    async createExperience(data: ICreateExperienceData): Promise<IExperienceDto> {
        try {
          const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
          const userId = request?.user?.id;

          if (!userId) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
          } 

          if(!data.jobName || !data.companyName || !data.startDate || !data.endDate){
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
          
          const newExperience = this._context.ExperienceRepo.create(data)
          const savedExperience = await this._context.ExperienceRepo.save(newExperience)

          return savedExperience as IExperienceDto;

        } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in ExperienceService - method createExperience() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            throw error;
        }
    }
    async updateExperience(data: IUpdateExperienceData): Promise<IExperienceDto> {
        try {
          const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
          const userId = request?.user?.id;

          if (!userId) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
          } 

          if(!data.jobName || !data.companyName || !data.startDate || !data.endDate || !data.id){
            throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Vui lòng kiểm tra lại dữ liệu của bạn");
          }

          const experience = await this._context.ExperienceRepo.findOne({
            where:{id: data.id}
          })

          if(!experience){
            throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy kinh nghiệm");
          }
          
          this._context.ExperienceRepo.merge(experience,data)
          const updatedExperience = await this._context.ExperienceRepo.save(experience)

          return updatedExperience as IExperienceDto;

        } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in ExperienceService - method updateExperience() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            throw error;
        }
    }
    async deleteExperience(experienceId: number): Promise<boolean> {
        try {
            
          if( !experienceId){
            throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Vui lòng kiểm tra lại dữ liệu của bạn");
          }

         const experience = await this._context.ExperienceRepo.findOne({
            where:{id: experienceId}
          })

          if(!experience){
            throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy kinh nghiệm");
          }

          const result = await this._context.ExperienceRepo.delete({id: experienceId})

          return result.affected > 0;
        } catch (error) {
          logger.error(error?.message);
          console.error(
              `Error in ExperienceService - method deleteExperience() at ${new Date().toISOString()} with message: ${error?.message}`
          )
          throw error;
        }
    }
    
}