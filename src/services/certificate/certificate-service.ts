import logger from "@/common/helpers/logger";
import { ICertificateDto, ICreateCertificateData, IUpdateCertificateData } from "@/dtos/certificate/certificate-dto";
import ICertificateService from "@/interfaces/certificate/certificate-interface";
import DatabaseService from "../common/database-service";
import { LocalStorage } from "@/common/constants/local-storage";
import { RequestStorage } from "@/common/middlewares/async-local-storage";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { EResumeType } from "@/common/enums/resume/resume-enum";
import { HttpException } from "@/errors/http-exception";
import { EAuthError } from "@/common/enums/error/EAuthError";
import { EGlobalError } from "@/common/enums/error/EGlobalError";


export default class CertificateService implements ICertificateService {
    private readonly _context : DatabaseService

    constructor(DatabaseService:DatabaseService){
        this._context = DatabaseService
    } 

    async getAllCertificates(): Promise<ICertificateDto[]> {
      try {
          const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
          const userId = request?.user?.id;

          if (!userId) {
            throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
          } 

          const certificates = await this._context.CertificateRepo.find({
            where:{resume:{ candidate:{ userId } }},
            order: { createdAt: 'DESC' }
          })

          return certificates as ICertificateDto[];
      } catch (error) {
          logger.error(error?.message);
          console.error(
            `Error in CertificateService - method getAllCertificates() at ${new Date().toISOString()} with message: ${error?.message}`
          )
          throw error;
        }
    }
    async createCertificate(data: ICreateCertificateData): Promise<ICertificateDto> {
      try {
        const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
        const userId = request?.user?.id;

        if (!userId) {
          throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
        } 

        if(!data.name || !data.trainingPlace || !data.startDate){
          throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Vui lòng kiểm tra lại dữ liệu của bạn");
        }

        if (data.expirationDate && data.startDate > data.expirationDate) {
            throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Ngày hết hạn phải sau ngày bắt đầu");
        }

        const onlineResume = await this._context.ResumeRepo.findOne({
          where: {
            type: EResumeType.ONLINE,
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

        const savedCertificate = await this._context.CertificateRepo.save(newCertificate)
        return savedCertificate as ICertificateDto;

        } catch (error) {
          logger.error(error?.message);
          console.error(
            `Error in CertificateService - method createCertificate() at ${new Date().toISOString()} with message: ${error?.message}`
          )
          throw error;
        }
    }
    async updateCertificate(data: IUpdateCertificateData): Promise<ICertificateDto> {
       try {
        
        if(!data.name || !data.trainingPlace || !data.id || !data.startDate){
          throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Vui lòng kiểm tra lại dữ liệu của bạn");
        }
        const certificate = await this._context.CertificateRepo.findOne({
          where:{id: data.id}
        })

        if(!certificate){
          throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy chứng chỉ");
        }

        this._context.CertificateRepo.merge(certificate,data)
        const updatedCertificate = await this._context.CertificateRepo.save(certificate)

        return updatedCertificate as ICertificateDto;

       } catch (error) {
           logger.error(error?.message);
          console.error(
            `Error in CertificateService - method updateCertificate() at ${new Date().toISOString()} with message: ${error?.message}`
          )
          throw error;
       }
    }
    async deleteCertificate(id: number): Promise<boolean> {
        try {
           const certificate = await this._context.CertificateRepo.findOne({
            where:{id}
          })

         if(!certificate){
          throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy chứng chỉ");
         } 

          const result = await this._context.CertificateRepo.delete({
            id
          })

          return result.affected > 0;

        } catch (error) {
          logger.error(error?.message);
          console.error(
            `Error in CertificateService - method deleteCertificate() at ${new Date().toISOString()} with message: ${error?.message}`
          )
          throw error;
        }
    }
}