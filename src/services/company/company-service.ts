import { ICompanyData } from "@/dtos/company/CompanyDto";
import ICompanyService from "@/interfaces/company/company-interface";
import DatabaseService from "../common/database-service";
import logger from "@/common/helpers/logger";
import { HttpException } from "@/errors/http-exception";
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
import { ICompanyDto, ICompanyWithImagesDto, ICompanyDetail, IUpdateCompanyRequest, IGetCompaniesReqParams, ICompanyStatistics, IApplicationMonthly, IApplicationByStatus, IGetEmployerStatisticsRequest } from "@/interfaces/company/company-dto";
import { IPaginationResponse } from "@/interfaces/base/IPaginationBase";
import { EGlobalError } from "@/common/enums/error/EGlobalError";
import { EAuthError } from "@/common/enums/error/EAuthError";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { EJobPostStatus } from "@/common/enums/job/EJobPostStatus";
import { EJobPostActivityStatus } from "@/common/enums/job/EJobPostActivity";
import { LessThan } from "typeorm";

export default class CompanyService implements ICompanyService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
    }
    async getSavedCompanies(): Promise<ICompanyWithImagesDto[]> {
        try {
            const candidateId = getCurrentUser()?.candidateId;
            if (!candidateId) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "Candidate Id not found");
            }

            const companies = await this._context.CompanyRepo
                .createQueryBuilder('company')
                .innerJoin('company.followedCompanies', 'followedCompany', 'followedCompany.candidateId = :candidateId', { candidateId })
                .leftJoinAndSelect('company.companyImages', 'companyImage')
                .leftJoinAndSelect('companyImage.image', 'myJobFile',
                    "myJobFile.fileType IN (:...types) AND myJobFile.deletedAt IS NULL",
                    { types: [FileType.LOGO, FileType.COVER_IMAGE] })
                .getMany();

            const companyDtos = companies.map(company => {
                const dto = CompanyMapper.toCompanyWithImagesDto(company);
                dto.isFollowed = true;
                return dto;
            });

            return companyDtos;
        } catch (error) {
            throw error;
        }
    }
    async toggleFollowCompany(companyId: number): Promise<boolean> {
        try {
            const candidateId = getCurrentUser().candidateId
            if (!candidateId) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "Candidate Id not found")
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
            throw error
        }
    }
    async getCompanyDetail(companyId: number): Promise<ICompanyDetail> {
        try {
            if (!companyId) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.InvalidInput, "Company id not found")
            }
            const company = await this._context.CompanyRepo
                .createQueryBuilder('company')
                .leftJoinAndSelect('company.companyImages', 'ci')
                .leftJoinAndSelect('ci.image', 'file', 'file.deletedAt IS NULL')
                .leftJoinAndSelect('company.jobPosts', 'jobPost')
                .where('company.id = :id', { id: companyId })
                .getOne();

            if (company == null) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Company not found")
            }
            return CompanyMapper.toCompanyWithJobsDto(company);
        } catch (error) {
            throw error
        }
    }
    async updateCompanyInfo(request: IUpdateCompanyRequest): Promise<ICompanyDto> {
        try {
            const companyId = getCurrentUser()?.companyId;

            if (!companyId) {
                throw new HttpException(
                    StatusCodes.UNAUTHORIZED,
                    EAuthError.UnauthorizedAccess,
                    "Company Id not found"
                );
            }

            const company = await this._context.CompanyRepo.findOne({
                where: { id: companyId }
            });

            if (!company) {
                throw new HttpException(
                    StatusCodes.NOT_FOUND,
                    EGlobalError.ResourceNotFound,
                    "Company not found"
                );
            }

            // Merge the request data into company entity
            this._context.CompanyRepo.merge(company, {
                companyName: request.companyName,
                companyEmail: request.companyEmail,
                companyPhone: request.companyPhone,
                taxCode: request.taxCode,
                provinceId: request.provinceId,
                address: request.address,
                description: request.description,
                websiteUrl: request.websiteUrl,
                facebookUrl: request.facebookUrl,
                youtubeUrl: request.youtubeUrl,
                linkedInUrl: request.linkedInUrl,
                since: request.since,
                fieldOperation: request.fieldOperation,
                employeeSize: request.employeeSize,
            });

            const updatedCompany = await this._context.CompanyRepo.save(company);
            return CompanyMapper.toCompanyDto(updatedCompany);
        } catch (error) {
            logger.error('Error updating company info:', error);
            throw error;
        }
    }
    async uploadCompanyCoverImage(image: Express.Multer.File): Promise<IMyJobFileDto> {
        try {
            if (!image) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.InvalidInput, "Image not found")
            }
            const companyId = getCurrentUser().companyId
            if (!companyId) {
                throw new HttpException(StatusCodes.FORBIDDEN, EGlobalError.UnauthorizedAccess, "Company id not found")
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
            throw error
        }
    }
    async uploadCompanyLogo(image: Express.Multer.File): Promise<IMyJobFileDto> {
        try {
            if (!image) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.InvalidInput, "Image not found")
            }
            const companyId = getCurrentUser().companyId
            if (!companyId) {
                throw new HttpException(StatusCodes.FORBIDDEN, EGlobalError.UnauthorizedAccess, "company id not found")
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
            throw error
        }
    }
    async uploadCompanyImages(images: Express.Multer.File[]): Promise<MyJobFileDto[]> {
        try {
            if (!images) {
                throw new HttpException(StatusCodes.BAD_GATEWAY, EGlobalError.InvalidInput, "Image not found")
            }
            const companyId = getCurrentUser().companyId
            if (!companyId) {
                throw new HttpException(StatusCodes.FORBIDDEN, EAuthError.UnauthorizedAccess, "Company Id not found")
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
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.InvalidInput, "Company Id not found")
            }
            const company = await this._context.CompanyRepo
                .createQueryBuilder('company')
                .leftJoinAndSelect('company.companyImages', 'ci')
                .leftJoinAndSelect('ci.image', 'file', 'file.deletedAt IS NULL')
                .where('company.id = :id', { id: companyId })
                .getOne();

            if (company == null) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Company not found")
            }
            return CompanyMapper.toCompanyWithImagesDto(company);
        } catch (error) {
            throw error;
        }
    }
    async getCompanies(params: IGetCompaniesReqParams): Promise<IPaginationResponse<ICompanyWithImagesDto>> {
        try {
            const { page, limit, companyName, provinceId } = params;

            const query = this._context.CompanyRepo
                .createQueryBuilder('company')
                .leftJoinAndSelect('company.companyImages', 'companyImage')
                .leftJoinAndSelect('companyImage.image', 'myJobFile',
                    "myJobFile.fileType IN (:...types) AND myJobFile.deletedAt IS NULL",
                    { types: [FileType.LOGO, FileType.COVER_IMAGE] });

            if (companyName && companyName.trim() !== "") {
                query.andWhere("company.companyName ILIKE :search", { search: `%${companyName}%` });
            }

            if (provinceId) {
                query.andWhere("company.provinceId = :provinceId", { provinceId });
            }

            const totalItems = await query.getCount();
            const companies = await query
                .orderBy("company.createdAt", "DESC")
                .skip((page - 1) * limit)
                .take(limit)
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

            return {
                items: companyDtos,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            };
        } catch (error) {
            throw error;
        }
    }
    async createCompanyInfo(data: ICompanyData): Promise<ICompanyDto> {
        try {
            const companyInfo = await this._context.CompanyRepo.create(data)
            const savedCompany = await this._context.CompanyRepo.save(companyInfo)
            return CompanyMapper.toCompanyDto(savedCompany);
        } catch (error) {
            throw error;
        }
    }

    async getEmployerStatistics(params?: IGetEmployerStatisticsRequest): Promise<ICompanyStatistics> {
        try {
            const companyId = getCurrentUser()?.companyId;

            if (!companyId) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
            }

            // Parse date range for charts only
            const startDate = params?.startDate ? new Date(params.startDate) : undefined;
            const endDate = params?.endDate ? new Date(params.endDate) : undefined;

            // Set endDate to end of day if provided
            if (endDate) {
                endDate.setHours(23, 59, 59, 999);
            }

            // Get all job post IDs for this company (unfiltered)
            const jobPosts = await this._context.JobPostRepo.find({
                where: { companyId },
                select: ['id']
            });
            const jobPostIds = jobPosts.map(jp => jp.id);

            // Build base query for job posts WITHOUT date filter (for stats)
            const jobPostQb = this._context.JobPostRepo.createQueryBuilder('jp')
                .where('jp.companyId = :companyId', { companyId });

            // Get total job posts (unfiltered)
            const totalJobPosts = await jobPostQb.getCount();

            // Get pending job posts (unfiltered)
            const pendingJobPosts = await jobPostQb
                .clone()
                .andWhere('jp.status = :status', { status: EJobPostStatus.PENDING_APPROVAL })
                .getCount();

            // Get expired job posts (unfiltered)
            const currentDate = new Date();
            const expiredJobPosts = await jobPostQb
                .clone()
                .andWhere('jp.deadline < :currentDate', { currentDate })
                .getCount();

            // Get total applications (unfiltered - for stats box)
            const totalApplications = jobPostIds.length > 0
                ? await this._context.JobPostActivityRepo.createQueryBuilder('activity')
                    .where('activity.isDeleted = :isDeleted', { isDeleted: false })
                    .andWhere('activity.jobPostId IN (:...ids)', { ids: jobPostIds })
                    .getCount()
                : 0;

            // Build application query WITH date filter (for charts only)
            const buildApplicationQueryForCharts = () => {
                const qb = this._context.JobPostActivityRepo.createQueryBuilder('activity')
                    .where('activity.isDeleted = :isDeleted', { isDeleted: false });

                if (jobPostIds.length > 0) {
                    qb.andWhere('activity.jobPostId IN (:...ids)', { ids: jobPostIds });
                }
                if (startDate) {
                    qb.andWhere('activity.createdAt >= :startDate', { startDate });
                }
                if (endDate) {
                    qb.andWhere('activity.createdAt <= :endDate', { endDate });
                }
                return qb;
            };

            // Get applications by status (filtered by date for chart)
            const applicationsByStatus: IApplicationByStatus[] = [];
            const statusNames: Record<number, string> = {
                [EJobPostActivityStatus.PENDING]: 'Chờ duyệt',
                [EJobPostActivityStatus.INTERVIEWED]: 'Đã phỏng vấn',
                [EJobPostActivityStatus.ACCEPTED]: 'Đã chấp nhận',
                [EJobPostActivityStatus.REJECTED]: 'Đã từ chối',
            };

            for (const [statusKey, statusName] of Object.entries(statusNames)) {
                const status = parseInt(statusKey);
                let count = 0;

                if (jobPostIds.length > 0) {
                    count = await buildApplicationQueryForCharts()
                        .andWhere('activity.status = :status', { status })
                        .getCount();
                }

                applicationsByStatus.push({
                    status,
                    statusName,
                    count
                });
            }

            // Get monthly applications (filtered by date if provided)
            const applicationsMonthly: IApplicationMonthly[] = [];
            const currentYear = currentDate.getFullYear();

            // If date range is provided, use it to filter monthly data
            if (startDate || endDate) {
                // Determine the range of months to display based on date filter
                const filterStartDate = startDate || new Date(2023, 0, 1);
                const filterEndDate = endDate || currentDate;

                const startMonth = filterStartDate.getMonth();
                const startYear = filterStartDate.getFullYear();
                const endMonth = filterEndDate.getMonth();
                const endYear = filterEndDate.getFullYear();

                // Loop through months in the filtered range
                for (let year = startYear; year <= endYear; year++) {
                    const monthStart = year === startYear ? startMonth : 0;
                    const monthEnd = year === endYear ? endMonth : 11;

                    for (let month = monthStart; month <= monthEnd; month++) {
                        const monthDate = new Date(year, month, 1);
                        const monthName = monthDate.toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' });
                        const monthStartDate = new Date(year, month, 1);
                        const monthEndDate = new Date(year, month + 1, 0, 23, 59, 59);

                        let count = 0;

                        if (jobPostIds.length > 0) {
                            count = await this._context.JobPostActivityRepo
                                .createQueryBuilder('activity')
                                .where('activity.jobPostId IN (:...ids)', { ids: jobPostIds })
                                .andWhere('activity.isDeleted = :isDeleted', { isDeleted: false })
                                .andWhere('activity.createdAt >= :startDate', { startDate: monthStartDate })
                                .andWhere('activity.createdAt <= :endDate', { endDate: monthEndDate })
                                .getCount();
                        }

                        applicationsMonthly.push({
                            month: monthName,
                            year2024: year === 2024 ? count : 0,
                            year2023: year === 2023 ? count : 0
                        });
                    }
                }
            } else {
                // No date filter - show last 12 months with 2023/2024 comparison
                for (let i = 11; i >= 0; i--) {
                    const monthDate = new Date(currentYear, currentDate.getMonth() - i, 1);
                    const monthName = monthDate.toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' });
                    const month = monthDate.getMonth() + 1;
                    const startDate2024 = new Date(2024, month - 1, 1);
                    const endDate2024 = new Date(2024, month, 0, 23, 59, 59);
                    const startDate2023 = new Date(2023, month - 1, 1);
                    const endDate2023 = new Date(2023, month, 0, 23, 59, 59);

                    let count2024 = 0;
                    let count2023 = 0;

                    if (jobPostIds.length > 0) {
                        count2024 = await this._context.JobPostActivityRepo
                            .createQueryBuilder('activity')
                            .where('activity.jobPostId IN (:...ids)', { ids: jobPostIds })
                            .andWhere('activity.isDeleted = :isDeleted', { isDeleted: false })
                            .andWhere('activity.createdAt >= :startDate', { startDate: startDate2024 })
                            .andWhere('activity.createdAt <= :endDate', { endDate: endDate2024 })
                            .getCount();

                        count2023 = await this._context.JobPostActivityRepo
                            .createQueryBuilder('activity')
                            .where('activity.jobPostId IN (:...ids)', { ids: jobPostIds })
                            .andWhere('activity.isDeleted = :isDeleted', { isDeleted: false })
                            .andWhere('activity.createdAt >= :startDate', { startDate: startDate2023 })
                            .andWhere('activity.createdAt <= :endDate', { endDate: endDate2023 })
                            .getCount();
                    }

                    applicationsMonthly.push({
                        month: monthName,
                        year2024: count2024,
                        year2023: count2023
                    });
                }
            }

            const statistics: ICompanyStatistics = {
                totalJobPosts,
                pendingJobPosts,
                expiredJobPosts,
                totalApplications,
                applicationsByStatus,
                applicationsMonthly
            };

            return statistics;

        } catch (error) {
            logger.error('Error getting employer statistics:', error);
            throw error;
        }
    }

}
