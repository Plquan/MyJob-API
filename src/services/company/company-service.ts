import { IResponseBase } from "@/interfaces/base/IResponseBase";
import { ICompanyData } from "@/dtos/company/CompanyDto";
import ICompanyService from "@/interfaces/company/company-interface";
import DatabaseService from "../common/database-service";
import { StatusCodes } from "http-status-codes";
import logger from "@/common/helpers/logger";
import { HttpException } from "@/errors/http-exception";
import { ErrorMessages } from "@/common/constants/ErrorMessages";
import { plainToInstance } from "class-transformer";
import { FileType } from "@/common/enums/file-type/file-types";
import { MyJobFileDto } from "@/dtos/myjob-file/myjob-file-dto";
import CloudinaryService from "../common/cloudinary-service";
import { CloudinaryResourceType } from "@/common/constants/cloudinary-resource-type";
import MyjobFileMapper from "@/mappers/myjob-file/myjob-file-mapper";
import { MyJobFile } from "@/entities/myjob-file";
import { getCurrentUser } from "@/common/helpers/get-current-user";
import { CompanyImage } from "@/entities/company-image";
import { IMyJobFileDto } from "@/interfaces/myjobfile/myjobfile-dto";
import { CompanyMapper } from "@/mappers/company/company-mapper";
import { ICompanyDto, ICompanyWithImagesDto, ICompanyDetail, IUpdateCompanyRequest } from "@/interfaces/company/company-dto";
import { EGlobalError } from "@/common/enums/error/EGlobalError";
import { EAuthError } from "@/common/enums/error/EAuthError";

export default class CompanyService implements ICompanyService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
    }
    async toggleFollowCompany(companyId: number): Promise<boolean> {
        try {
            const candidateId = getCurrentUser().candidateId
            if (!candidateId) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess.toString())
            }
            const isFollowedCompany = await this._context.FollowedCompanyRepo.findOne({
                where: { candidateId, companyId }
            })
            if (isFollowedCompany) {
                await this._context.FollowedCompanyRepo.remove(isFollowedCompany);
                return false;
            }
            const newFollowCompany = CompanyMapper.toFollowedCompanyFromCreate(candidateId, companyId)
            await this._context.FollowedCompanyRepo.save(newFollowCompany);
            return true;
        } catch (error) {
            logger.error(`Error in CompanyService - method createCompanyInfo with message ${error?.message}`);
            console.log(
                `Error in CompanyService - method createCompanyInfo with message ${error?.message}`
            )
        }
    }
    async getCompanyDetail(companyId: number): Promise<ICompanyDetail> {
        try {
            if (!companyId) {
                throw new HttpException(StatusCodes.NOT_FOUND, "Company id not found")
            }
            const company = await this._context.CompanyRepo
                .createQueryBuilder('company')
                .leftJoinAndSelect('company.companyImages', 'ci')
                .leftJoinAndSelect('ci.image', 'file', 'file.deletedAt IS NULL')
                .leftJoinAndSelect('company.jobPosts', 'jobPost')
                .where('company.id = :id', { id: companyId })
                .getOne();

            if (company == null) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound.toString())
            }
            return CompanyMapper.toCompanyWithJobsDto(company);
        } catch (error) {

        }
    }
    updateCompanyInfo(request: IUpdateCompanyRequest): Promise<ICompanyDto> {
        throw new Error("Method not implemented.");
    }
    async uploadCompanyCoverImage(image: Express.Multer.File): Promise<IMyJobFileDto> {
        try {
            if (!image) {
                throw new HttpException(StatusCodes.NOT_FOUND, ErrorMessages.INVALID_REQUEST_BODY)
            }
            const companyId = getCurrentUser().companyId
            if (!companyId) {
                throw new HttpException(StatusCodes.FORBIDDEN, ErrorMessages.FORBIDDEN)
            }
            const companyImage = await this._context.MyJobFileRepo
                .createQueryBuilder('myJobFile')
                .innerJoin('myJobFile.companyImages', 'companyImage')
                .where('companyImage.companyId = :companyId', { companyId })
                .andWhere('myJobFile.fileType = :fileType', { fileType: FileType.COVER_IMAGE })
                .getOne();

            const result = await CloudinaryService.uploadFile(
                image,
                FileType.COVER_IMAGE,
                CloudinaryResourceType.IMAGE,
                companyImage?.publicId ?? undefined
            );
            const newImage = MyjobFileMapper.toMyJobFileFromCreate(result, FileType.COVER_IMAGE)
            const savedFile = await this._context.MyJobFileRepo.save(
                companyImage ? this._context.MyJobFileRepo.merge(companyImage, newImage) : newImage
            )
            if (!companyImage) {
                const newCompanyImage = new CompanyImage()
                newCompanyImage.companyId = companyId,
                    newCompanyImage.imageId = savedFile.id
                await this._context.CompanyImageRepo.save(newCompanyImage)
            }
            return savedFile
        } catch (error) {
            console.log(
                `Error in CompanyService - method uploadCompanyCoverImage at ${new Date().getTime()} with message ${error?.message}`)
            throw error
        }
    }
    async uploadCompanyLogo(image: Express.Multer.File): Promise<IMyJobFileDto> {
        try {
            if (!image) {
                throw new HttpException(StatusCodes.NOT_FOUND, ErrorMessages.INVALID_REQUEST_BODY)
            }
            const companyId = getCurrentUser().companyId
            if (!companyId) {
                throw new HttpException(StatusCodes.FORBIDDEN, ErrorMessages.FORBIDDEN)
            }

            const companyImage = await this._context.MyJobFileRepo
                .createQueryBuilder('myJobFile')
                .innerJoin('myJobFile.companyImages', 'companyImage')
                .where('companyImage.companyId = :companyId', { companyId })
                .andWhere('myJobFile.fileType = :fileType', { fileType: FileType.LOGO })
                .getOne();
            const result = await CloudinaryService.uploadFile(
                image,
                FileType.LOGO,
                CloudinaryResourceType.IMAGE,
                companyImage?.publicId ?? undefined
            );

            const newImage = MyjobFileMapper.toMyJobFileFromCreate(result, FileType.LOGO)

            const savedFile = await this._context.MyJobFileRepo.save(
                companyImage ? this._context.MyJobFileRepo.merge(companyImage, newImage) : newImage
            )
            if (!companyImage) {

                const newCompanyImage = new CompanyImage()
                newCompanyImage.companyId = companyId,
                    newCompanyImage.imageId = savedFile.id
                await this._context.CompanyImageRepo.save(newCompanyImage)
            }
            return savedFile
        } catch (error) {
            console.log(
                `Error in CompanyService - method uploadCompanyLogo at ${new Date().getTime()} with message ${error?.message}`)
            throw error
        }
    }
    async uploadCompanyImages(images: Express.Multer.File[]): Promise<MyJobFileDto[]> {
        try {
            if (!images) {
                throw new HttpException(StatusCodes.BAD_GATEWAY, ErrorMessages.INVALID_REQUEST_BODY)
            }
            const companyId = getCurrentUser().companyId
            if (!companyId) {
                throw new HttpException(StatusCodes.FORBIDDEN, ErrorMessages.FORBIDDEN)
            }

            let newFiles: MyJobFile[] = []
            let newCompanyFiles: CompanyImage[] = []
            for (const image of images) {
                const result = await CloudinaryService.uploadFile(
                    image,
                    FileType.COMPANY_IMAGE,
                    CloudinaryResourceType.IMAGE,
                );
                newFiles.push(MyjobFileMapper.toMyJobFileFromCreate(result, FileType.COMPANY_IMAGE));
            }
            const savedFiles = await this._context.MyJobFileRepo.save(newFiles);

            for (const file of savedFiles) {
                const companyFile = new CompanyImage()
                companyFile.companyId = companyId,
                    companyFile.imageId = file.id
                newCompanyFiles.push(companyFile);
            }

            await this._context.CompanyImageRepo.save(newCompanyFiles);

            const myJobFiledtos = plainToInstance(MyJobFileDto, savedFiles, { excludeExtraneousValues: true });
            return myJobFiledtos;
        } catch (error) {
            console.log(`Error in CompanyService - method uploadCompanyImages at ${new Date().getTime()} with message ${error?.message}`)
            throw error
        }
    }
    async deleteCompanyImage(imageId: number): Promise<boolean> {
        try {
            const image = await this._context.MyJobFileRepo.findOne({
                where: { id: imageId }
            });
            image.deletedAt = new Date();
            await this._context.MyJobFileRepo.save(image);
            return true;
        } catch (error) {
            throw error
        }
    }
    async getCompanyById(companyId: number): Promise<ICompanyWithImagesDto> {
        try {
            if (!companyId) {
                throw new HttpException(StatusCodes.NOT_FOUND, "Company id not found")
            }
            const company = await this._context.CompanyRepo
                .createQueryBuilder('company')
                .leftJoinAndSelect('company.companyImages', 'ci')
                .leftJoinAndSelect('ci.image', 'file', 'file.deletedAt IS NULL')
                .where('company.id = :id', { id: companyId })
                .getOne();

            if (company == null) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound.toString())
            }
            return CompanyMapper.toCompanyWithImagesDto(company);
        } catch (error) {
            console.log(`Error in CompanyService - method getCompanyById at ${new Date().getTime()} with message ${error?.message}`)
            throw error;
        }
    }
    async getCompanies(): Promise<ICompanyWithImagesDto[]> {
        try {
            const companies = await this._context.CompanyRepo
                .createQueryBuilder('company')
                .leftJoinAndSelect('company.companyImages', 'companyImage')
                .leftJoinAndSelect('companyImage.image', 'myJobFile',
                    "myJobFile.fileType IN (:...types)",
                    { types: [FileType.LOGO, FileType.COVER_IMAGE] })
                .getMany();

            const candidateId = getCurrentUser()?.candidateId
            const followedCompanyIds = new Set<number>();

            if (candidateId) {
                const companyFollowed = await this._context.FollowedCompanyRepo.find({
                    where: { candidateId },
                    select: ['companyId'],
                });
                for (const f of companyFollowed) {
                    followedCompanyIds.add(f.companyId);
                }
            }

            const companyDtos = companies.map(company => {
                const dto = CompanyMapper.toCompanyWithImagesDto(company);
                dto.isFollowed = followedCompanyIds.has(company.id);
                return dto;
            });

            return companyDtos;
        } catch (error) {
            console.log(`Error in CompanyService - method getCompanies with message ${error?.message}`)
            throw error;
        }
    }
    async createCompanyInfo(data: ICompanyData): Promise<IResponseBase> {
        try {
            const companyInfo = await this._context.CompanyRepo.create(data)
            await this._context.CompanyRepo.save(companyInfo)

            return {
                status: StatusCodes.CREATED,
                success: true,
                message: "Create company profile success"
            }

        } catch (error) {
            logger.error(error?.message);
            console.log(
                `Error in CompanyService - method createCompanyInfo at ${new Date().getTime()} with message ${error?.message}`
            )
        }
    }

}
