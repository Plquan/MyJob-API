import { IResponseBase } from "@/interfaces/base/IResponseBase";
import { ICreateExperienceData, IUpdateExperienceData } from "@/interfaces/experience/ExperienceDto";
import IExperienceService from "@/interfaces/experience/IExperienceService";
import DatabaseService from "../common/DatabaseService";
import { LocalStorage } from "@/constants/LocalStorage";
import logger from "@/helpers/logger";
import { RequestStorage } from "@/middlewares";
import { StatusCodes } from "http-status-codes";
import { VariableSystem } from "@/constants/VariableSystem";

export default class ExperienceService implements IExperienceService {

    private readonly _context:DatabaseService

    constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }
    
    async getAllExperiences(): Promise<IResponseBase> {
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

          const experiences = await this._context.ExperienceRepo.find({
            where:{resume:{ candidate:{ userId } }},
            order: { createdAt: 'DESC' }
          })

           return {
              status: StatusCodes.OK,
              message:"Lấy danh sách thành công",
              success: true,
              data: experiences         
            }
          } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in ExperienceService - method getAllExperiences() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi khi lấy danh sách kinh nghiệm, vui lòng thử lại sau",
            }
        }
    }
    async createExperience(data: ICreateExperienceData): Promise<IResponseBase> {
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

          if(!data.jobName || !data.companyName || !data.startDate || !data.endDate){
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
          
          const newExperience = this._context.ExperienceRepo.create(data)
          await this._context.ExperienceRepo.save(newExperience)

           return {
              status: StatusCodes.CREATED,
              message:"Thêm kinh nghiệm thành công",
              success: true,
              data: newExperience         
            }

        } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in ExperienceService - method createExperience() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi khi lấy danh sách kinh nghiệm, vui lòng thử lại sau",
            }
        }
    }
    async updateExperience(data: IUpdateExperienceData): Promise<IResponseBase> {
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

          if(!data.jobName || !data.companyName || !data.startDate || !data.endDate || !data.id){
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
    async deleteExperience(experienceId: number): Promise<IResponseBase> {
        try {
            
          if( !experienceId){
            return {
                message: "Vui lòng kiểm tra lại dữ liệu của bạn",
                success: false,
                status: StatusCodes.BAD_REQUEST,
            }
          }

         const experience = await this._context.ExperienceRepo.findOne({
            where:{id: experienceId}
          })

          if(!experience){
             return{
                status: StatusCodes.NOT_FOUND,
                success:false,
                message: "Không tìm thấy kinh nghiệm"
             }
          }

          await this._context.ExperienceRepo.delete({id: experienceId})

          return {
            status:StatusCodes.OK,
            message:"Xóa kinh nghiệm thành công",
            success: true,
            data: experienceId
          }        
        } catch (error) {
          logger.error(error?.message);
          console.error(
              `Error in ExperienceService - method deleteExperience() at ${new Date().toISOString()} with message: ${error?.message}`
          )
          return {
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              success: false,
              message: "Lỗi khi lấy danh sách kinh nghiệm, vui lòng thử lại sau",
          }
        }
    }
    
}