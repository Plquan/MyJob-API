import { IResponseBase } from "@/interfaces/base/IResponseBase";
import DatabaseService from "../common/DatabaseService";
import { LocalStorage } from "@/constants/LocalStorage";
import logger from "@/helpers/logger";
import { StatusCodes } from "http-status-codes";
import { VariableSystem } from "@/constants/VariableSystem";
import ISkillService from "@/interfaces/skill/ISkillService";
import { ICreateSkillData, IUpdateSkillData } from "@/interfaces/skill/SkillDto";
import { RequestStorage } from "@/middlewares/AsyncLocalStorage";


export default class SkillService implements ISkillService {

    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }

    async getAllSkills(): Promise<IResponseBase> {
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

          const skills = await this._context.SkillRepo.find({
            where:{resume:{ candidate:{ userId } }},
            order: { createdAt: 'DESC' }
          })

           return {
              status: StatusCodes.OK,
              message:"Lấy danh sách ngôn ngữ thành công",
              success: true,
              data: skills         
            }
          } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in SkillService - method getAllSkills() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi lấy danh sách kĩ năng, vui lòng thử lại sau",
            }
        }
    }
    async createSkill(data: ICreateSkillData): Promise<IResponseBase> {
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

          if(!data.name || !data.level){
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
          
          const newSkill = this._context.SkillRepo.create(data)
          await this._context.SkillRepo.save(newSkill)

           return {
              status: StatusCodes.CREATED,
              message:"Thêm kĩ năng thành công",
              success: true,
              data: newSkill         
            }

        } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in SkillService - method createSkill() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi thêm kĩ năng, vui lòng thử lại sau",
            }
        }
    }
    async updateSkill(data: IUpdateSkillData): Promise<IResponseBase> {
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

          if(!data.name || !data.level || !data.id){
            return {
                message: "Vui lòng kiểm tra lại dữ liệu của bạn",
                success: false,
                status: StatusCodes.BAD_REQUEST,
            }
          }

          const skill = await this._context.SkillRepo.findOne({
            where:{id: data.id}
          })

          if(!skill){
             return{
                status: StatusCodes.NOT_FOUND,
                success:false,
                message: "Không tìm thấy kĩ năng"
             }
          }
          
          this._context.SkillRepo.merge(skill,data)
          await this._context.SkillRepo.save(skill)

        return {
            status: StatusCodes.CREATED,
            message:"cập nhật kĩ năng thành công",
            success: true,
            data: skill         
        }

        } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in SkillService - method updateSkill() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi cập nhật kĩ năng, vui lòng thử lại sau",
            }
        }
    }
    async deleteSkill(skillId: number): Promise<IResponseBase> {
         try {
            
          if(!skillId){
            return {
                message: "Vui lòng kiểm tra lại dữ liệu của bạn",
                success: false,
                status: StatusCodes.BAD_REQUEST,
            }
          }

         const Skill = await this._context.SkillRepo.findOne({
            where:{id: skillId}
          })

          if(!Skill){
             return{
                status: StatusCodes.NOT_FOUND,
                success:false,
                message: "Không tìm thấy ngôn ngữ"
             }
          }

          await this._context.SkillRepo.delete({id: skillId})

          return {
            status:StatusCodes.OK,
            message:"Xóa kĩ năng thành công",
            success: true,
            data: skillId
          }        
        } catch (error) {
          logger.error(error?.message);
          console.error(
              `Error in SkillService - method deleteSkill() at ${new Date().toISOString()} with message: ${error?.message}`
          )
          return {
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              success: false,
              message: "Lỗi xóa kĩ năng, vui lòng thử lại sau",
          }
        }
    }

}