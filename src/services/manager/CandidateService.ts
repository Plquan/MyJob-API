import { LocalStorage } from "@/constants/LocalStorage";
import { IResponseBase } from "@/interfaces/base/IResponseBase";
import ICandidateService from "@/interfaces/candidate/ICandidateService";
import { RequestStorage } from "@/middlewares";
import { StatusCodes } from "http-status-codes";
import DatabaseService from "../common/DatabaseService";
import logger from "@/helpers/logger";
import { ErrorMessages } from "@/constants/ErrorMessages";
import { VariableSystem } from "@/constants/VariableSystem";
import { User } from "@/entity/User";
import { EntityManager } from "typeorm";

export default class CandidateService implements ICandidateService {

    private readonly _context: DatabaseService

    constructor(DatabaseService:DatabaseService){
        this._context = DatabaseService
    }

    async createCandidateProfile(user: User,manager: EntityManager): Promise<IResponseBase> {
        try {

         const newCandidateProfile = await manager.save(
            this._context.CandidateRepo.create({ user })
          );

          await manager.save(
            this._context.ResumeRepo.create({
              candidate: newCandidateProfile,
              type: VariableSystem.CV_TYPE.CV_ONLINE,
            })
          )

          return {
            status: StatusCodes.CREATED,
            success: true,
            message: "Tạo hồ sơ ứng viên thành công",
          };
        } catch (error: any) {
          logger.error(error?.message);
          console.log(`Error in CandidateService - method createCandidateProfile at ${new Date().getTime()} with message ${error?.message}`);

          return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: ErrorMessages.INTERNAL_SERVER_ERROR,
          }
        }
     }

    async getCandidateOnlineResume(): Promise<IResponseBase> {
        try {
            const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
            const userId = request?.user.id;

           if (!userId) {
            return {
              status: StatusCodes.UNAUTHORIZED,
              success: false,
              message: "Bạn không có quyền truy cập",
            }
          }

          const onlineResume = await this._context.ResumeRepo.createQueryBuilder('resume')
            .leftJoinAndSelect('resume.candidate', 'candidate')
            .leftJoinAndSelect('resume.educations', 'educations')
            .leftJoinAndSelect('resume.certificates', 'certificate')
            .leftJoinAndSelect('resume.experiences', 'experience')
            .leftJoinAndSelect('resume.languages', 'language')
            .leftJoinAndSelect('resume.advancedSkills', 'advancedSkill')
            .where('resume.type = :type', { type: VariableSystem.CV_TYPE.CV_ONLINE })
            .andWhere('candidate.userId = :userId', { userId })
            .getOne();

          if(!onlineResume){
            return {
             status: StatusCodes.BAD_REQUEST,
              success: false,
              message: "Không tìm thấy hồ sơ online",
            }
          }

          return {
            status:StatusCodes.OK,
            success:true,
            message:"Lấy hồ sơ thành công",
            data:onlineResume
          }


        } catch (error) {
            logger.error(error?.message);
            console.log(
                `Error in CandidateService - method updateAvatar at ${new Date().getTime()} with message ${error?.message}`
            );
            return {
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                success: false,
                message: "Lỗi lấy hồ sơ cá nhân, vui lòng thử lại sau",
            }
        }
    }
    
}