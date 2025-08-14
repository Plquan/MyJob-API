import logger from "@/common/helpers/logger";
import { IResponseBase } from "@/interfaces/base/IResponseBase";
import { ICreateCertificateData, IUpdateCertificateData } from "@/dtos/certificate/certificate-dto";
import ICertificateService from "@/interfaces/certificate/certificate-interface";
import { StatusCodes } from "http-status-codes";
import DatabaseService from "../common/database-service";
import { LocalStorage } from "@/common/constants/local-storage";
import { VariableSystem } from "@/common/constants/VariableSystem";
import { RequestStorage } from "@/common/middlewares/async-local-storage";


export default class CertificateService implements ICertificateService {
    private readonly _context : DatabaseService

    constructor(DatabaseService:DatabaseService){
        this._context = DatabaseService
    } 

    async getAllCertificates(): Promise<IResponseBase> {
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

          const certificates = await this._context.CertificateRepo.find({
            where:{resume:{ candidate:{ userId } }},
            order: { createdAt: 'DESC' }
          })

           return {
              status: StatusCodes.OK,
              message:"Lấy danh sách thành công",
              success: true,
              data: certificates         
            }
          } catch (error) {
            logger.error(error?.message);
          console.error(
            `Error in CertificateService - method getAllCertificates() at ${new Date().toISOString()} with message: ${error?.message}`
          )
          return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Lỗi lấy danh sách chứng chỉ, vui lòng thử lại sau",
          }
        }
    }
    async createCertificate(data: ICreateCertificateData): Promise<IResponseBase> {
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

        if(!data.name || !data.trainingPlace || !data.startDate){
          return {
            message: "Vui lòng kiểm tra lại dữ liệu của bạn",
            success: false,
            status: StatusCodes.BAD_REQUEST,
          }
        }

        if (data.expirationDate && data.startDate > data.expirationDate) {
            return {
                status: StatusCodes.BAD_REQUEST,
                success: false,
                message: "Ngày hết hạn phải sau ngày bắt đầu",
            }
        }

        const onlineResume = await this._context.ResumeRepo.findOne({
          where: {
            type: VariableSystem.CV_TYPE.CV_ONLINE,
            candidate: { userId },
          }
        })
 
        const newCertificate =  this._context.CertificateRepo.create({
            resumeId: onlineResume.id,
            name: data.name,
            trainingPlace: data.trainingPlace,
            startDate: data.startDate,
            expirationDate: data.expirationDate
        })

        await this._context.CertificateRepo.save(newCertificate)
            return {
                status: StatusCodes.CREATED,
                message:"Thêm chứng chỉ thành công",
                success: true,
                data: newCertificate         
            }

        } catch (error) {
          logger.error(error?.message);
          console.error(
            `Error in CertificateService - method createCertificate() at ${new Date().toISOString()} with message: ${error?.message}`
          )
          return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Lỗi lấy hồ sơ cá nhân, vui lòng thử lại sau",
          }
        }
    }
    async updateCertificate(data: IUpdateCertificateData): Promise<IResponseBase> {
       try {
        
        if(!data.name || !data.trainingPlace || !data.id || !data.startDate){
          return {
            message: "Vui lòng kiểm tra lại dữ liệu của bạn",
            success: false,
            status: StatusCodes.BAD_REQUEST,
          }
        }
        const certificate = await this._context.CertificateRepo.findOne({
          where:{id: data.id}
        })

        if(!certificate){
          return {
            status: StatusCodes.NOT_FOUND,
            success: false,
            message: "Không tìm thấy chứng chỉ",
          }
        }

        this._context.CertificateRepo.merge(certificate,data)
        await this._context.CertificateRepo.save(certificate)

        return {
            status: StatusCodes.OK,
            success: true,
            message: "Cập nhật thành công",
            data:certificate
        }

       } catch (error) {
           logger.error(error?.message);
          console.error(
            `Error in CertificateService - method updateCertificate() at ${new Date().toISOString()} with message: ${error?.message}`
          )
          return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Lỗi cập nhật hồ sơ cá nhân, vui lòng thử lại sau",
          }
       }
    }
    async deleteCertificate(id: number): Promise<IResponseBase> {
        try {
           const certificate = await this._context.CertificateRepo.findOne({
            where:{id}
          })

         if(!certificate){
          return {
            status: StatusCodes.NOT_FOUND,
            success: false,
            message: "Không tìm thấy chứng chỉ",
          }
         } 

          await this._context.CertificateRepo.delete({
            id
          })

          return {
            status: StatusCodes.OK,
            success: true,
            message: "Xóa chứng chỉ thành công",
            data:id
         }

        } catch (error) {
          logger.error(error?.message);
          console.error(
            `Error in CertificateService - method createCertificate() at ${new Date().toISOString()} with message: ${error?.message}`
          )
          return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Lỗi lấy hồ sơ cá nhân, vui lòng thử lại sau",
          }
        }
    }
}