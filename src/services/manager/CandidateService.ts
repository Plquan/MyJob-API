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
import { ICandidateData, IResumeData } from "@/interfaces/candidate/CandidateDto";

export default class CandidateService implements ICandidateService {

    private readonly _context: DatabaseService

    constructor(DatabaseService:DatabaseService){
        this._context = DatabaseService
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

    async updateProfile(data: ICandidateData): Promise<IResponseBase> {
      try {
        const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
        const userId = request?.user?.id;

        if (!userId) {
          return {
            status: StatusCodes.UNAUTHORIZED,
            success: false,
            message: "Bạn không có quyền truy cập"
          }
        }

         const candidateProfile =  await this._context.CandidateRepo.findOne({ where: { userId } })

        if (!candidateProfile) {
          return {
            status: StatusCodes.NOT_FOUND,
            success: false,
            message: "Không tìm thấy thông tin người dùng"
          }
        }

        this._context.CandidateRepo.merge(candidateProfile, {
          provinceId: data.provinceId,
          districtId: data.districtId,
          phone: data.phone,
          birthday: data.birthday,
          gender: data.gender,
          maritalStatus: data.maritalStatus,
          address: data.address,
        })

        await this._context.CandidateRepo.save(candidateProfile)

        const updatedProfile = await this._context.CandidateRepo.findOne({
            where: { id: candidateProfile.id },
            relations: ['district', 'province'],
          })

        return {
          status: StatusCodes.OK,
          success: true,
          message: "Cập nhật thông tin thành công",
          data: updatedProfile
        }

      } catch (error) {
        logger.error(error?.message);
        console.error(`Error in CandidateService - updateCandidateProfile at ${new Date().toISOString()} - ${error?.message}`);
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi cập nhật thông tin người dùng, vui lòng thử lại sau",
        }
      }
    }
    async createProfile(user: User,manager: EntityManager): Promise<IResponseBase> {
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
          `Error in CandidateService - method getCandidateOnlineResume at ${new Date().toISOString()} with message: ${error?.message}`
        );

        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi lấy hồ sơ cá nhân, vui lòng thử lại sau",
        };
      }
    }

    
}