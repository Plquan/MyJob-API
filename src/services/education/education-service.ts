import IEducationService from "@/interfaces/education/education-interface";
import DatabaseService from "../common/database-service";
import { LocalStorage } from "@/common/constants/local-storage";
import logger from "@/common/helpers/logger";
import { ICreateEducationData, IUpdateEducationData, IEducationDto } from "@/dtos/education/education-dto";
import { RequestStorage } from "@/common/middlewares/async-local-storage";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { EResumeType } from "@/common/enums/resume/resume-enum";
import { HttpException } from "@/errors/http-exception";
import { EAuthError } from "@/common/enums/error/EAuthError";
import { EGlobalError } from "@/common/enums/error/EGlobalError";


export default class EducationService implements IEducationService {

  private readonly _context: DatabaseService

  constructor(DatabaseService: DatabaseService) {
    this._context = DatabaseService
  }

  async getAllEducations(): Promise<IEducationDto[]> {
    try {
      const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
      const userId = request?.user?.id;

      if (!userId) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
      }

      const educations = await this._context.EducationRepo.find({
        where: { resume: { candidate: { userId } } },
        order: { createdAt: 'DESC' }
      })

      return educations as IEducationDto[];

    } catch (error) {
      logger.error(error?.message);
      console.error(
        `Error in EducationService - method getAllEducations() at ${new Date().toISOString()} with message: ${error?.message}`
      )
      throw error;
    }
  }
  async createEducation(data: ICreateEducationData): Promise<IEducationDto> {
    try {
      const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
      const userId = request?.user?.id;

      if (!userId) {
        throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
      }

      if (!data.degreeName || !data.major || !data.trainingPlace || !data.startDate) {
        throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Vui lòng kiểm tra lại dữ liệu của bạn");
      }

      const onlineResume = await this._context.ResumeRepo.findOne({
        where: {
          type: EResumeType.ONLINE,
          candidate: { userId }
        }
      })

      if (!onlineResume) {
        throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy hồ sơ online của bạn");
      }

      data.resumeId = onlineResume.id

      const newEducation = this._context.EducationRepo.create(data)
      const savedEducation = await this._context.EducationRepo.save(newEducation)

      return savedEducation as IEducationDto;

    } catch (error) {
      logger.error(error?.message);
      console.error(
        `Error in EducationService - method createEducation() at ${new Date().toISOString()} with message: ${error?.message}`
      )
      throw error;
    }
  }
  async updateEducation(data: IUpdateEducationData): Promise<IEducationDto> {
    try {
      if (!data.degreeName || !data.major || !data.trainingPlace || !data.startDate || !data.id) {
        throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Vui lòng kiểm tra lại dữ liệu của bạn");
      }
      const education = await this._context.EducationRepo.findOne({
        where: { id: data.id }
      })

      if (!education) {
        throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy thông tin học vấn");
      }
      this._context.EducationRepo.merge(education, data)
      const updatedEducation = await this._context.EducationRepo.save(education)

      return updatedEducation as IEducationDto;

    } catch (error) {
      logger.error(error?.message);
      console.error(
        `Error in EducationService - method updateEducation() at ${new Date().toISOString()} with message: ${error?.message}`
      )
      throw error;
    }
  }
  async deleteEducation(educationId: number): Promise<boolean> {
    try {
      if (!educationId) {
        throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Vui lòng kiểm tra lại dữ liệu của bạn");
      }

      const education = await this._context.EducationRepo.findOne({
        where: { id: educationId }
      })

      if (!education) {
        throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy thông tin học vấn");
      }
      const result = await this._context.EducationRepo.delete({ id: educationId })

      return result.affected > 0;

    } catch (error) {
      logger.error(error?.message);
      console.error(
        `Error in EducationService - method deleteEducation() at ${new Date().toISOString()} with message: ${error?.message}`
      )
      throw error;
    }
  }

}