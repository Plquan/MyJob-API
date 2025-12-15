import { IResponseBase } from "@/interfaces/base/IResponseBase"
import IResumeService from "@/interfaces/resume/resume-interface"
import DatabaseService from "../common/database-service"
import { LocalStorage } from "@/common/constants/local-storage"
import logger from "@/common/helpers/logger"
import CloudinaryService from "../common/cloudinary-service"
import { MyJobFile } from "@/entities/myjob-file"
import { Resume } from "@/entities/resume"
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
import { FileType } from "@/common/enums/file-type/file-types"
import { ResumeMapper } from "@/mappers/resume/resume-mapper"
import { IOnlineResumeDto, IResumeDto } from "@/dtos/resume/resume-dto"
import { EGlobalError } from "@/common/enums/error/EGlobalError"
import { getCurrentUser } from "@/common/helpers/get-current-user"


export default class ResumeService implements IResumeService {

  private readonly _context: DatabaseService


  constructor(DatabaseService: DatabaseService) {
    this._context = DatabaseService

  }
  async getResumeById(attchedResumeId: number): Promise<IResumeDto> {
    try {

      const resume = await this._context.ResumeRepo.findOne({
        where: { id: attchedResumeId },
        relations: ['myJobFile']
      })
      return resume
    } catch (error) {
      throw error
    }
  }
  async updateAttachedResume(data: UpdateAttachedResumeRequest, file?: Express.Multer.File): Promise<IResumeDto> {
    try {
      const attachedResume = await this._context.ResumeRepo.findOne({
        where: { id: data.id },
        relations: ['myJobFile'],
      });

      if (!attachedResume) {
        throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Attached Resume not found")
      }

      const dataSource = this._context.getDataSource();
      await dataSource.transaction(async (manager) => {
        if (file) {
          const result = await CloudinaryService.uploadFile(
            file,
            FileType.CV_UPLOAD,
            CloudinaryResourceType.RAW,
            attachedResume.myJobFile?.publicId ?? undefined
          );

          if (!result?.public_id || !result?.secure_url) {
            throw new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, EGlobalError.ServerError, "Upload file failed")
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
      const updatedAttachedResume = await this.getResumeById(data.id)
      return updatedAttachedResume
    } catch (error) {
      throw error
    }
  }
  async deleteResume(attachedResumeId: number): Promise<boolean> {
    try {
      const user = getCurrentUser()

      if(!user){
        throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "User not found")
      }

      const resume = await this._context.ResumeRepo.findOne({
        where: { id: attachedResumeId },
        relations: ['myJobFile']
      })
      if (!resume) {
        throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Attached Resume not found")
      }
      if (resume.type == EResumeType.ONLINE) {
        throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.DeleteFailed, "Cannot delete online resume")
      }
      if (resume.myJobFile?.id) {
        await this._context.MyJobFileRepo.softDelete(resume.myJobFile.id)
      }
      await this._context.ResumeRepo.delete(attachedResumeId)

      if (resume.selected == true) {
        const onlineResume = await this._context.ResumeRepo.findOne({
          where: { candidateId: user.candidateId, type: EResumeType.ONLINE },
        })
        onlineResume.selected = true
        if (onlineResume) {
          await this._context.ResumeRepo.update(
            { id: onlineResume.id },
            { selected: true }
          );
        }
      }

      return true

    } catch (error) {
      throw error
    }
  }
  async createResume(data: UploadAttachedResumeRequest, file: Express.Multer.File, candidateId: number): Promise<IResumeDto> {
    if (!candidateId) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Candidate id not found")
    }

    const queryRunner = this._context.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {

      const result = await CloudinaryService.uploadFile(
        file,
        FileType.CV_UPLOAD,
        CloudinaryResourceType.RAW
      )

      if (!result?.public_id || !result?.secure_url) {
        await queryRunner.rollbackTransaction()
        throw new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, EGlobalError.ServerError, "Upload file failed")
      }
      const newFile = queryRunner.manager.create(MyJobFile, {
        publicId: result.public_id,
        url: result.secure_url,
        fileType: FileType.CV_UPLOAD,
        resourceType: result.resource_type,
        format: getFileCategory(file),
      })
      await queryRunner.manager.save(MyJobFile, newFile)
      data.candidateId = candidateId
      data.myJobFileId = newFile.id
      data.type = EResumeType.ATTACHED

      const newAttachedResume = queryRunner.manager.create(Resume, data)
      await queryRunner.manager.save(Resume, newAttachedResume)
      await queryRunner.commitTransaction()
      const createdAttachedResume = await this.getResumeById(newAttachedResume.id)
      return createdAttachedResume
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }
  async getResumes(): Promise<IResumeDto[]> {
    try {

      const user = getCurrentUser()
      if (!user) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "User not found")
      }

      const resumes = await this._context.ResumeRepo.find({
        where: { candidateId: user.candidateId },
        relations: ['myJobFile'],
        order: {
          createdAt: 'ASC',
        }
      })

      return resumes
    } catch (error) {
      throw error
    }
  }
  async getOnlineResume(): Promise<IOnlineResumeDto> {
    try {
      const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
      const userId = request?.user?.id;

      if (!userId) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "User Id not found")
      }

      const onlineResume = await this._context.ResumeRepo.findOne({
        where: {
          type: EResumeType.ONLINE,
          candidate: { userId },
        },
        relations: [
          'candidate',
          'educations',
          'certificates',
          'experiences',
          'languages',
          'skills',
        ],
      })

      if (!onlineResume) {
        throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Online Resume not found")
      }
      onlineResume.educations?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      onlineResume.certificates?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      onlineResume.experiences?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      onlineResume.languages?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      onlineResume.skills?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return ResumeMapper.toOnlineResumeDto(onlineResume);
    } catch (error) {
      throw error
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
        where: { candidate: { userId } }
      })

      if (!onineResume) {
        return {
          status: StatusCodes.NOT_FOUND,
          success: false,
          message: "Không tìm thấy hồ sơ người dùng"
        }
      }

      this._context.ResumeRepo.merge(onineResume, data)
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
        where: { userId }
      })

      if (!candidate) {
        return {
          status: StatusCodes.NOT_FOUND,
          success: false,
          message: "Không tìm thấy hồ sơ người dùng"
        }
      }

      await this._context.ResumeRepo.update(
        { candidateId: candidate.id },
        { selected: false }
      )

      await this._context.ResumeRepo.update(
        { id: resumeId },
        { selected: true }
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