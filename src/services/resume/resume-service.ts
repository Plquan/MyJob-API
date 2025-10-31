import { IResponseBase } from "@/interfaces/base/IResponseBase"
import IResumeService from "@/interfaces/resume/resume-interface"
import DatabaseService from "../common/database-service"
import { LocalStorage } from "@/common/constants/local-storage"
import { VariableSystem } from "@/common/constants/VariableSystem"
import logger from "@/common/helpers/logger"
import CloudinaryService from "../common/cloudinary-service"
import { MyJobFile } from "@/entities/myjob-file"
import { Resume } from "@/entities/resume"
import { Candidate } from "@/entities/candidate"
import { CloudinaryResourceType } from "@/common/constants/cloudinary-resource-type"
import { getFileCategory } from "@/common/ultils/fileUltils"
import { RequestStorage } from "@/common/middlewares/async-local-storage"
import { UpdateAttachedResumeRequest } from "@/dtos/resume/update-attached-resume-request"
import { UploadAttachedResumeRequest } from "@/dtos/resume/upload-attached-resume-request"
import { UpdateOnlineResumeRequest } from "@/dtos/resume/update-online-resume-request"
import { StatusCodes } from "@/common/enums/status-code/status-code.enum"
import { EResumeType } from "@/common/enums/resume/resume-enum"
import { HttpException } from "@/errors/http-exception"
import { EAuthError } from "@/common/enums/error/EAuthError"


export default class ResumeService implements IResumeService {
    
     private readonly _context:DatabaseService

     constructor(DatabaseService: DatabaseService){
        this._context = DatabaseService
    }
    async getAttachedResumeById(attchedResumeId: number): Promise<IResponseBase> {
      try {

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
    async updateAttachedResume(data: UpdateAttachedResumeRequest, file?: Express.Multer.File): Promise<IResponseBase> {
      try {
        const attachedResume = await this._context.ResumeRepo.findOne({
          where: { id: data.id },
          relations: ['myJobFile'],
        });

        if (!attachedResume) {
          return {
            status: StatusCodes.NOT_FOUND,
            message: "Không tìm thấy hồ sơ đính kèm",
            success: false,
          }
        }

        const dataSource = this._context.getDataSource();
        await dataSource.transaction(async (manager) => {
          if (file) {
            const result = await CloudinaryService.uploadFile(
              file,
              VariableSystem.FolderType.CV_UPLOAD,
              CloudinaryResourceType.RAW,
              attachedResume.myJobFile?.publicId ?? undefined
            );

            if (!result?.public_id || !result?.secure_url) {
              throw new Error("Tải lên tệp thất bại");
            }

            if (attachedResume.myJobFile) {
              attachedResume.myJobFile.publicId = result.public_id;
              attachedResume.myJobFile.url = result.secure_url;
              await manager.save(attachedResume.myJobFile);
            }
          }

          manager.merge(Resume, attachedResume, data);
          await manager.save(attachedResume);
        })

        const updatedAttachedResume = await this.getAttachedResumeById(data.id)

        if(!updatedAttachedResume.data){
          return {
            status: StatusCodes.NOT_FOUND,
            message: "Không tìm thấy hồ sơ đã tạo",
            success:false
          }
        }

        return {
          status: StatusCodes.OK,
          message: "Cập nhật hồ sơ thành công",
          success: true,
          data: updatedAttachedResume.data
        }

      } catch (error) {
        logger.error(error?.message);
        console.error(
          `Error in ResumeService - method updateAttachedResume() at ${new Date().toISOString()} with message: ${error?.message}`
        );
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi cập nhật hồ sơ đính kèm, vui lòng thử lại sau",
        };
      }
    }
    async deleteAttachedResume(attachedResumeId: number): Promise<IResponseBase> {
      try {
        const attachedResume = await this._context.ResumeRepo.findOne({
          where:{id:attachedResumeId},
          relations:['myJobFile']
        })
        if(!attachedResume){
           return{
            status: StatusCodes.NOT_FOUND,
            message: "Không tìm thấy hồ sơ đính kèm",
            success: false,
           }
        }
        if (attachedResume.myJobFile?.id) {
          await this._context.MyJobFileRepo.softDelete(attachedResume.myJobFile.id)
        }
        await this._context.ResumeRepo.delete(attachedResumeId)

        return{
          status: StatusCodes.OK,
            message: "Xóa hồ sơ đính kèm thành công",
            success: true,
        }
        
      } catch (error) {
        logger.error(error?.message)
        console.error(
          `Error in ResumeService - method deleteAttachedResume() at ${new Date().toISOString()} with message: ${error?.message}`
        )
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi xóa hồ sơ đính kèm, vui lòng thử lại sau",
        }
      }
    }
    async uploadAttachedResume(data: UploadAttachedResumeRequest, file: Express.Multer.File): Promise<IResponseBase> {
      const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE)
      const userId = request?.user.id

      if (!userId) {
        return {
          status: StatusCodes.UNAUTHORIZED,
          success: false,
          message: "Bạn không có quyền truy cập",
        }
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
           VariableSystem.FolderType.CV_UPLOAD,
           CloudinaryResourceType.RAW
          )

        if (!result?.public_id || !result?.secure_url) {
          await queryRunner.rollbackTransaction()
          return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Tải lên tệp thất bại",
          }
        }
        const newFile = queryRunner.manager.create(MyJobFile, {
          publicId: result.public_id,
          url: result.secure_url,
          fileType: VariableSystem.CV_TYPE.CV_ATTACHED,
          resourceType: result.resource_type,
          format: getFileCategory(file),
        })
        await queryRunner.manager.save(MyJobFile, newFile)
        data.candidateId = candidateProfile.id
        data.myJobFileId = newFile.id

        const newAttachedResume = queryRunner.manager.create(Resume, data)
        await queryRunner.manager.save(Resume, newAttachedResume)

        await queryRunner.commitTransaction()

        const createdAttachedResume = await this.getAttachedResumeById(newAttachedResume.id)

        if(!createdAttachedResume){
          return {
            status: StatusCodes.NOT_FOUND,
            message: "Không tìm thấy hồ sơ đã tạo",
            success:false
          }
        }

        return {
          status: StatusCodes.CREATED,
          message: "Thêm hồ sơ đính kèm thành công",
          success: true,
          data: createdAttachedResume.data
        }
        
      } catch (error) {
        await queryRunner.rollbackTransaction()
        logger.error(error?.message)
        console.error(
          `Error in ResumeService - method uploadAttachedResume() at ${new Date().toISOString()} with message: ${error?.message}`
        )
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi thêm hồ sơ đính kèm, vui lòng thử lại sau",
        }
      } finally {
        await queryRunner.release()
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
          where:{candidate:{userId}},
          relations: ['myJobFile'],
          order: {
          createdAt: 'DESC',
        }
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
          throw new HttpException(StatusCodes.UNAUTHORIZED,EAuthError.UnauthorizedAccess,"User id not found")
        }

        const onlineResume = await this._context.ResumeRepo.findOne({
          where: {
            type: EResumeType.ONLINE,
            candidate: { userId },
          },
          relations: [
            'candidate',
            'candidate.user',
            'candidate.user.avatar',
            'candidate.province', 
            'candidate.district', 
            'educations',
            'certificates',
            'experiences',
            'languages',
            'skills',
          ],
        })

        if (!onlineResume) {
          return {
            status: StatusCodes.NOT_FOUND,
            success: false,
            message: "Không tìm thấy hồ sơ trực tuyến",
          }
        }

         const {
          candidate,
          educations,
          certificates,
          experiences,
          languages,
          skills,
          ...resumeData
        } = onlineResume;

        const userInfo = {
          fullName: candidate.user.fullName,
          email: candidate.user.email,
          avatar: candidate.user.avatar,
        }

        const { user: _removedUser, ...candidateInfo } = candidate;

        return {
          status: StatusCodes.OK,
          success: true,
          message: "Lấy hồ sơ thành công",
          data: {
            userInfo,
            resume: resumeData,
            candidate: candidateInfo,
            educations,
            certificates,
            experiences,
            languages,
            skills,
          },
        }

      } catch (error) {
        logger.error(error?.message);
        console.error(
          `Error in CandidateService - method getOnlineResume at ${new Date().toISOString()} with message: ${error?.message}`
        )

        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi lấy hồ sơ cá nhân, vui lòng thử lại sau",
        }
      }
    }
    async updateOnlineResume(data: UpdateOnlineResumeRequest): Promise<IResponseBase> {
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
        console.error(`Error in resumeService - updateOnlineResume at ${new Date().toISOString()} - ${error?.message}`);
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi cập nhật hồ sơ người dùng, vui lòng thử lại sau",
        }
      }
    }
    async setSelectedResume(resumeId: number): Promise<IResponseBase> {
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
        const candidate = await this._context.CandidateRepo.findOne({
          where:{userId}
        })

        if(!candidate){
           return {
            status: StatusCodes.NOT_FOUND,
            success: false,
            message: "Không tìm thấy hồ sơ người dùng"
          }
        }

        await this._context.ResumeRepo.update(
          {candidateId:candidate.id},
          {selected:false}
        )

        await this._context.ResumeRepo.update(
          {id: resumeId},
          {selected: true}
        )

        return {
          status: StatusCodes.OK,
          success: true,
          message: "CV đã đánh dấu là được chọn",
        }
              
      } catch (error) {
         logger.error(error?.message);
        console.error(`Error in resumeService - updateOnlineResume at ${new Date().toISOString()} - ${error?.message}`);
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi cập nhật hồ sơ người dùng, vui lòng thử lại sau",
        }
      }
    }
}