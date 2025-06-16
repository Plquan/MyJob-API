import { IResponseBase } from "@/interfaces/base/IResponseBase";
import { IResumeData } from "@/interfaces/candidate/CandidateDto";
import IResumeService from "@/interfaces/resume/IResumeService";
import DatabaseService from "../common/DatabaseService";
import { LocalStorage } from "@/constants/LocalStorage";
import { VariableSystem } from "@/constants/VariableSystem";
import logger from "@/helpers/logger";
import { RequestStorage } from "@/middlewares";
import { StatusCodes } from "http-status-codes";


export default class ResumeService implements IResumeService {
    
    private readonly _context:DatabaseService

     constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }

    async getOnlineResume(): Promise<IResponseBase> {
      try {
        const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
        const userId = request?.user?.id;

        if (!userId) {
          return {
            status: StatusCodes.UNAUTHORIZED,
            success: false,
            message: "Bạn không có quyền truy cập",
          };
        }

        const onlineResume = await this._context.ResumeRepo.findOne({
          where: {
            type: VariableSystem.CV_TYPE.CV_ONLINE,
            candidate: { userId },
          },
          relations: [
            'candidate',
            'candidate.province', 
            'candidate.district', 
            'educations',
            'certificates',
            'experiences',
            'languages',
            'advancedSkills',
          ],
        });

        if (!onlineResume) {
          return {
            status: StatusCodes.NOT_FOUND,
            success: false,
            message: "Không tìm thấy hồ sơ trực tuyến",
          };
        }

        const {
          candidate,
          educations,
          certificates,
          experiences,
          languages,
          advancedSkills,
          ...resumeData
        } = onlineResume;

        return {
          status: StatusCodes.OK,
          success: true,
          message: "Lấy hồ sơ thành công",
          data: {
            resume: resumeData,
            candidate,
            educations,
            certificates,
            experiences,
            languages,
            advancedSkills,
          },
        };

      } catch (error) {
        logger.error(error?.message);
        console.error(
          `Error in CandidateService - method getOnlineResume at ${new Date().toISOString()} with message: ${error?.message}`
        );

        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi lấy hồ sơ cá nhân, vui lòng thử lại sau",
        };
      }
    }
    async updateOnlineResume(data: IResumeData): Promise<IResponseBase> {
     try {
      const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
      const userId = request?.user?.id

       if (!userId) {
          return {
            status: StatusCodes.UNAUTHORIZED,
            success: false,
            message: "Bạn không có quyền truy cập"
          }
        }

      const onineResume = await this._context.ResumeRepo.findOne({
        where:{candidate:{ userId }}
      })

      if(!onineResume){
          return {
            status: StatusCodes.NOT_FOUND,
            success: false,
            message: "Không tìm thấy hồ sơ người dùng"
          }
      }

        this._context.ResumeRepo.merge(onineResume,data)
        await this._context.ResumeRepo.save(onineResume)

      return {
        status: StatusCodes.OK,
        success: true,
        message: "Cập nhật thông tin thành công",
        data: data
       }

     } catch (error) {
          logger.error(error?.message);
        console.error(`Error in CandidateService - updateOnlineResume at ${new Date().toISOString()} - ${error?.message}`);
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi cập nhật hồ sơ người dùng, vui lòng thử lại sau",
        };
      }
    }
    
}