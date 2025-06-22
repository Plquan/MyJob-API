import { IResponseBase } from "@/interfaces/base/IResponseBase";
import { IResumeData } from "@/interfaces/candidate/CandidateDto";
import IResumeService from "@/interfaces/resume/IResumeService";
import DatabaseService from "../common/DatabaseService";
import { LocalStorage } from "@/constants/LocalStorage";
import { VariableSystem } from "@/constants/VariableSystem";
import logger from "@/helpers/logger";
import { RequestStorage } from "@/middlewares";
import { StatusCodes } from "http-status-codes";
import { IUpdateAttachedResumeData, IUploadAttachedResumeData } from "@/interfaces/resume/ResumeDto";
import CloudinaryService from "../common/CloudinaryService";
import { MyJobFile } from "@/entity/MyJobFile";
import { Resume } from "@/entity/Resume";
import { Candidate } from "@/entity/Candidate";
import { CloudinaryResourceType } from "@/constants/CloudinaryResourceType";


export default class ResumeService implements IResumeService {
    
    private readonly _context:DatabaseService

     constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }
    async getAttachedResumeById(attchedResumeId: number): Promise<IResponseBase> {
      try {

        if(!attchedResumeId){
          return {
            status: StatusCodes.BAD_REQUEST,
            message: "Vui lòng kiểm tra lại dữ liệu của bạn",
            success: false,
          }
        }

        const attachResume = await this._context.ResumeRepo.findOne({
          where:{id: attchedResumeId},
          relations: ['myJobFile']
       })

        return {
          status: StatusCodes.OK,
          success: true,
          message: "Lấy thông tin hồ sơ đính kèm thành công",
          data: attachResume
        }
        
      } catch (error) {
        logger.error(error?.message);
        console.error(
          `Error in ResumeService - method getAttachedResumeById() at ${new Date().toISOString()} with message: ${error?.message}`
        )
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi lấy hồ sơ đính kèm, vui lòng thử lại sau",
        }
      }
    }
    updateAttachedResume(data: IUpdateAttachedResumeData, file: Express.Multer.File): Promise<IResponseBase> {
      throw new Error("Method not implemented.");
    }
    deleteAttachedResume(attchedResumeId: number): Promise<IResponseBase> {
      throw new Error("Method not implemented.");
    }
    async uploadAttachedResume(data: IUploadAttachedResumeData, file: Express.Multer.File): Promise<IResponseBase> {
      if (
        !data.academicLevel || !data.careerId || !data.experience || !file ||
        !data.jobType || !data.position || !data.provinceId ||
        !data.salaryMax || !data.salaryMin || !data.description
      ) {
        return {
          status: StatusCodes.BAD_REQUEST,
          message: "Vui lòng kiểm tra lại dữ liệu của bạn",
          success: false,
        }
      }

      const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
      const userId = request?.user.id;

      if (!userId) {
        return {
          status: StatusCodes.UNAUTHORIZED,
          success: false,
          message: "Bạn không có quyền truy cập",
        };
      }

      const queryRunner = this._context.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()

      try {
        const candidateProfile = await queryRunner.manager.findOne(Candidate, {
          where: { userId },
        })

        if (!candidateProfile) {
          await queryRunner.rollbackTransaction();
          return {
            status: StatusCodes.NOT_FOUND,
            message: "Không tìm thấy hồ sơ ứng viên",
            success: false,
          }
        }

        const result = await CloudinaryService.uploadFile(
           file,
           VariableSystem.CV_TYPE.CV_ATTACHED,
           CloudinaryResourceType.RAW
          )
          
        if (!result?.public_id || !result?.secure_url) {
          await queryRunner.rollbackTransaction()
          return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Tải lên tệp thất bại",
          };
        }

        const newFile = queryRunner.manager.create(MyJobFile, {
          publicId: result.public_id,
          url: result.secure_url,
          fileType: VariableSystem.CV_TYPE.CV_ATTACHED,
        })
        await queryRunner.manager.save(MyJobFile, newFile)

        data.type = VariableSystem.CV_TYPE.CV_ATTACHED
        data.candidateId = candidateProfile.id
        data.myJobFileId = newFile.id

        const newAttachedResume = queryRunner.manager.create(Resume, data)
        await queryRunner.manager.save(Resume, newAttachedResume)

        await queryRunner.commitTransaction()

        return {
          status: StatusCodes.CREATED,
          message: "Thêm hồ sơ đính kèm thành công",
          success: true,
          data: newAttachedResume
        }
        
      } catch (error) {
        await queryRunner.rollbackTransaction();
        logger.error(error?.message);
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi thêm hồ sơ đính kèm, vui lòng thử lại sau",
        };
      } finally {
        await queryRunner.release();
      }
    }
    async getAllAttachedResumes(): Promise<IResponseBase> {
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

        const uploadResumes = await this._context.ResumeRepo.find({
          where:{candidate:{userId}, 
          type: VariableSystem.CV_TYPE.CV_ATTACHED, 
          },
          relations: ['myJobFile']
       })

        return {
          status: StatusCodes.OK,
          success: true,
          message: "Lấy danh sách hồ sơ tải lên thành công",
          data: uploadResumes
        }
        
      } catch (error) {
        logger.error(error?.message);
        console.error(
          `Error in ResumeService - method getAllUploadResumes() at ${new Date().toISOString()} with message: ${error?.message}`
        )
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi lấy hồ sơ tải lên, vui lòng thử lại sau",
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
          }
        }

        const onlineResume = await this._context.ResumeRepo.findOne({
          where: {
            type: VariableSystem.CV_TYPE.CV_ONLINE,
            candidate: { userId },
          }
        })

        if (!onlineResume) {
          return {
            status: StatusCodes.NOT_FOUND,
            success: false,
            message: "Không tìm thấy hồ sơ trực tuyến",
          };
        }
        return {
          status: StatusCodes.OK,
          success: true,
          message: "Lấy hồ sơ thành công",
          data: onlineResume     
          }

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