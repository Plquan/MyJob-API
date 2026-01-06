import DatabaseService from "../common/database-service";
import { LocalStorage } from "@/common/constants/local-storage";
import logger from "@/common/helpers/logger";
import ISkillService from "@/interfaces/skill/skill-interface";
import { ICreateSkillData, IUpdateSkillData, ISkillDto } from "@/dtos/skill/skill-dto";
import { RequestStorage } from "@/common/middlewares/async-local-storage";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { EResumeType } from "@/common/enums/resume/resume-enum";
import { HttpException } from "@/errors/http-exception";
import { EAuthError } from "@/common/enums/error/EAuthError";
import { EGlobalError } from "@/common/enums/error/EGlobalError";


export default class SkillService implements ISkillService {

    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }

    async getAllSkills(): Promise<ISkillDto[]> {
        try {
          const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE)
          const userId = request?.user?.id

          if (!userId) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
          } 

          const skills = await this._context.SkillRepo.find({
            where:{resume:{ candidate:{ userId } }},
            order: { createdAt: 'DESC' }
          })

          return skills as ISkillDto[];
        } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in SkillService - method getAllSkills() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            throw error;
        }
    }
    async createSkill(data: ICreateSkillData): Promise<ISkillDto> {
        try {
          const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
          const userId = request?.user?.id;

          if (!userId) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
          } 

          if(!data.name || !data.level){
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
          
          const newSkill = this._context.SkillRepo.create(data)
          const savedSkill = await this._context.SkillRepo.save(newSkill)

          return savedSkill as ISkillDto;

        } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in SkillService - method createSkill() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            throw error;
        }
    }
    async updateSkill(data: IUpdateSkillData): Promise<ISkillDto> {
         try {
          const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
          const userId = request?.user?.id;

          if (!userId) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
          } 

          if(!data.name || !data.level || !data.id){
            throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Vui lòng kiểm tra lại dữ liệu của bạn");
          }

          const skill = await this._context.SkillRepo.findOne({
            where:{id: data.id}
          })

          if(!skill){
            throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy kĩ năng");
          }
          
          this._context.SkillRepo.merge(skill,data)
          const updatedSkill = await this._context.SkillRepo.save(skill)

          return updatedSkill as ISkillDto;

        } catch (error) {
            logger.error(error?.message);
            console.error(
                `Error in SkillService - method updateSkill() at ${new Date().toISOString()} with message: ${error?.message}`
            )
            throw error;
        }
    }
    async deleteSkill(skillId: number): Promise<boolean> {
         try {
            
          if(!skillId){
            throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Vui lòng kiểm tra lại dữ liệu của bạn");
          }

         const skill = await this._context.SkillRepo.findOne({
            where:{id: skillId}
          })

          if(!skill){
            throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy kĩ năng");
          }

          const result = await this._context.SkillRepo.delete({id: skillId})

          return result.affected > 0;
        } catch (error) {
          logger.error(error?.message);
          console.error(
              `Error in SkillService - method deleteSkill() at ${new Date().toISOString()} with message: ${error?.message}`
          )
          throw error;
        }
    }

}