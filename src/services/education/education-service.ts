import { IResponseBase } from "@/interfaces/base/IResponseBase";
import { ICreateCertificateData, IUpdateCertificateData } from "@/dtos/certificate/certificate-dto";
import IEducationService from "@/interfaces/education/education-interface";
import DatabaseService from "../common/database-service";
import { LocalStorage } from "@/common/constants/local-storage";
import logger from "@/common/helpers/logger";
import { StatusCodes } from "http-status-codes";
import { VariableSystem } from "@/common/constants/VariableSystem";
import { ICreateEducationData, IUpdateEducationData } from "@/dtos/education/education-dto";
import { RequestStorage } from "@/common/middlewares/async-local-storage";


export default class EducationService implements IEducationService {

  private readonly _context: DatabaseService

  constructor(DatabaseService: DatabaseService) {
    this._context = DatabaseService
  }

  async getAllEducations(): Promise<IResponseBase> {
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

      const educations = await this._context.EducationRepo.find({
        where: { resume: { candidate: { userId } } },
        order: { createdAt: 'DESC' }
      })

      return {
        status: StatusCodes.OK,
        message: "Lấy danh sách học vấn thành công",
        success: true,
        data: educations
      }

    } catch (error) {
      logger.error(error?.message);
      console.error(
        `Error in EducationService - method getAllEducations() at ${new Date().toISOString()} with message: ${error?.message}`
      )
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Lỗi lấy danh sách học vấn, vui lòng thử lại sau",
      }
    }
  }
  async createEducation(data: ICreateEducationData): Promise<IResponseBase> {
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

      if (!data.degreeName || !data.major || !data.trainingPlace || !data.startDate) {
        return {
          message: "Vui lòng kiểm tra lại dữ liệu của bạn",
          success: false,
          status: StatusCodes.BAD_REQUEST,
        }
      }

      const onlineResume = await this._context.ResumeRepo.findOne({
        where: {
          type: VariableSystem.CV_TYPE.CV_ONLINE,
          candidate: { userId }
        }
      })

      if (!onlineResume) {
        return {
          status: StatusCodes.NOT_FOUND,
          success: false,
          message: "Không tìm thấy hồ sơ online của bạn",
        }
      }

      data.resumeId = onlineResume.id

      const newEducation = this._context.EducationRepo.create(data)
      await this._context.EducationRepo.save(newEducation)

      return {
        status: StatusCodes.CREATED,
        success: true,
        message: "Tạo mới thông tin học vấn thành công",
        data: newEducation
      }

    } catch (error) {
      logger.error(error?.message);
      console.error(
        `Error in EducationService - method createEducation() at ${new Date().toISOString()} with message: ${error?.message}`
      )
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Lỗi tạo học vấn, vui lòng thử lại sau",
      }
    }
  }
  async updateEducation(data: IUpdateEducationData): Promise<IResponseBase> {
    try {
      if (!data.degreeName || !data.major || !data.trainingPlace || !data.startDate || !data.id) {
        return {
          message: "Vui lòng kiểm tra lại dữ liệu của bạn",
          success: false,
          status: StatusCodes.BAD_REQUEST,
        }
      }
      const education = await this._context.EducationRepo.findOne({
        where: { id: data.id }
      })

      if (!education) {
        return {
          status: StatusCodes.NOT_FOUND,
          success: false,
          message: "Không tìm thấy thông tin học vấn"
        }
      }
      this._context.EducationRepo.merge(education, data)
      await this._context.EducationRepo.save(education)

      return {
        status: StatusCodes.OK,
        success: true,
        message: "Cập nhật thông tin học vấn thành công",
        data: education
      }

    } catch (error) {
      logger.error(error?.message);
      console.error(
        `Error in EducationService - method updateEducation() at ${new Date().toISOString()} with message: ${error?.message}`
      )
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Lỗi cập nhật học vấn, vui lòng thử lại sau",
      }
    }
  }
  async deleteEducation(educationId: number): Promise<IResponseBase> {
    try {
      if (!educationId) {
        return {
          message: "Vui lòng kiểm tra lại dữ liệu của bạn",
          success: false,
          status: StatusCodes.BAD_REQUEST,
        }
      }

      const education = await this._context.EducationRepo.findOne({
        where: { id: educationId }
      })

      if (!education) {
        return {
          status: StatusCodes.NOT_FOUND,
          success: false,
          message: "Không tim thấy thông tin học vấn"
        }
      }
      await this._context.EducationRepo.delete({ id: educationId })

      return {
        status: StatusCodes.OK,
        success: true,
        message: "Xóa thông tin học vấn thành công",
        data: educationId
      }

    } catch (error) {
      logger.error(error?.message);
      console.error(
        `Error in EducationService - method deleteEducation() at ${new Date().toISOString()} with message: ${error?.message}`
      )
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Lỗi xóa thông tin học vấn, vui lòng thử lại sau",
      }
    }
  }

}