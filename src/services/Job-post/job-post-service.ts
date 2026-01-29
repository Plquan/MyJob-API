import { JobPost } from "@/entities/job-post";
import IJobPostService from "@/interfaces/job-post/job-post-interface";
import DatabaseService from "../common/database-service";
import { ICompanyJobPostDto, ICreateJobPostReq, IGetCompanyJobPostsReqParams, IGetJobPostsReqParams, IJobPostDto, IUpdateJobPostReq } from "@/interfaces/job-post/job-post-dto";
import { HttpException } from "@/errors/http-exception";
import { getCurrentUser } from "@/common/helpers/get-current-user";
import JobPostMapper from "@/mappers/job-post/job-post-mapper";
import { EGlobalError } from "@/common/enums/error/EGlobalError";
import { Brackets } from "typeorm";
import { IPaginationResponse } from "@/interfaces/base/IPaginationBase";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { FileType } from "@/common/enums/file-type/file-types";
import { EJobPostStatus } from "@/common/enums/job/EJobPostStatus";
import { NotificationType } from "@/entities/notification";
import SocketService from "../common/socket-service";
import { Console } from "console";

export default class JobPostService implements IJobPostService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
    }
    async getAllJobPost(params: IGetCompanyJobPostsReqParams): Promise<IPaginationResponse<ICompanyJobPostDto>> {
        try {
            const { page, limit, search, jobPostStatus } = params;

            const query = this._context.JobPostRepo.createQueryBuilder("job")
                .leftJoinAndSelect("job.company", "company")
                .leftJoin("job.jobPostActivities", "activity")
                .loadRelationCountAndMap("job.activityCount", "job.jobPostActivities");

            if (jobPostStatus) {
                query.andWhere("job.status = :status", { status: jobPostStatus });
            }

            if (search && search.trim() !== "") {
                query.andWhere(
                    new Brackets((qb) => {
                        qb.where("job.jobName ILIKE :search", { search: `%${search}%` })

                    })
                );
            }

            const totalItems = await query.getCount();
            const jobPosts = await query
                .orderBy("job.createdAt", "DESC")
                .skip((page - 1) * limit)
                .take(limit)
                .getMany();

            return {
                items: JobPostMapper.toListCompanyJobPostDto(jobPosts),
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            };
        } catch (error) {
            throw error
        }
    }

    async getJobPostById(jobPostId: number): Promise<IJobPostDto> {
        const candidateId = getCurrentUser()?.candidateId
        try {
            const jobPost = await this._context.JobPostRepo.createQueryBuilder("job")
                .leftJoinAndSelect("job.company", "company")
                .leftJoinAndSelect("company.companyImages", "companyImage")
                .leftJoinAndSelect("companyImage.image", "image", "image.fileType = :fileType", { fileType: FileType.LOGO })
                .leftJoinAndSelect("job.savedJobPosts", "savedJobPost", "savedJobPost.candidateId = :candidateId", {
                    candidateId: candidateId ?? null
                })
                .leftJoinAndSelect(
                    "job.jobPostActivities",
                    "jobPostActivity",
                    "jobPostActivity.candidateId = :candidateId",
                    { candidateId: candidateId ?? null }
                )
                .where("job.id = :jobPostId", { jobPostId })
                .getOne()
            return JobPostMapper.toJobPosDto(jobPost, candidateId);
        } catch (error) {
            throw error
        }
    }
    async toggleSaveJobPost(jobPostId: number): Promise<boolean> {
        try {
            const candidateId = getCurrentUser()?.candidateId
            if (!candidateId) {
                throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.UnauthorizedAccess, "Unauthorize")
            }
            const savedJobPost = await this._context.SavedJobPostRepo.findOne({
                where: { jobPostId, candidateId }
            })
            if (!savedJobPost) {
                const newSavedJobPost = this._context.SavedJobPostRepo.create({
                    candidateId,
                    jobPostId
                })
                await this._context.SavedJobPostRepo.save(newSavedJobPost)
                return true
            }
            else {
                await this._context.SavedJobPostRepo.delete(savedJobPost.id)
                return false
            }
        } catch (error) {
            throw error
        }
    }
    async getJobPosts(params: IGetJobPostsReqParams): Promise<IPaginationResponse<IJobPostDto>> {
        try {
            const {
                page,
                limit,
                jobName,
                careerId,
                provinceId,
                position,
                jobType,
                experience,
                academicLevel,
                salaryMin,
                salaryMax,
                postedWithinDays,
                companyId
            } = params;
            const candidateId = getCurrentUser()?.candidateId;

            const query = this._context.JobPostRepo.createQueryBuilder("job")
                .select([
                    "job.id",
                    "job.jobName",
                    "job.salaryMin",
                    "job.salaryMax",
                    "job.provinceId",
                    "job.createdAt",
                    "job.updatedAt",
                    "job.hotExpiredAt",
                    "job.deadline"
                ])
                .leftJoinAndSelect("job.company", "company")
                .leftJoinAndSelect("company.companyImages", "companyImage")
                .leftJoinAndSelect("companyImage.image", "image", "image.fileType = :fileType AND image.deletedAt IS NULL", { fileType: FileType.LOGO })
                .leftJoinAndSelect("job.savedJobPosts", "savedJobPost", "savedJobPost.candidateId = :candidateId", {
                    candidateId: candidateId ?? null
                })
                .where("job.status = :status", { status: EJobPostStatus.APPROVED });

            if (jobName && jobName.trim() !== "") {
                query.andWhere("job.jobName ILIKE :search", { search: `%${jobName}%` });
            }

            if (careerId) {
                query.andWhere("job.careerId = :careerId", { careerId });
            }

            if (provinceId) {
                query.andWhere("job.provinceId = :provinceId", { provinceId });
            }

            if (position) {
                query.andWhere("job.position = :position", { position });
            }

            if (jobType) {
                query.andWhere("job.jobType = :jobType", { jobType });
            }

            if (experience) {
                query.andWhere("job.experience = :experience", { experience });
            }

            if (academicLevel) {
                query.andWhere("job.academicLevel = :academicLevel", { academicLevel });
            }

            if (salaryMin !== undefined) {
                query.andWhere("job.salaryMax >= :salaryMin", { salaryMin });
            }

            if (salaryMax !== undefined) {
                query.andWhere("job.salaryMin <= :salaryMax", { salaryMax });
            }

            if (postedWithinDays) {
                const dateThreshold = new Date();
                dateThreshold.setDate(dateThreshold.getDate() - postedWithinDays);
                query.andWhere("job.createdAt >= :dateThreshold", { dateThreshold });
            }

            if (companyId) {
                query.andWhere("job.companyId = :companyId", { companyId });
            }

            query.andWhere("job.expiredAt >= NOW()");

            const totalItems = await query.getCount();

            const jobPosts = await query
                .addOrderBy("job.updatedAt", "DESC")
                .skip((page - 1) * limit)
                .take(limit)
                .getMany();

            return {
                items: JobPostMapper.toListJobPostDto(jobPosts, candidateId),
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            };

        } catch (error) {
            throw error
        }
    }
    deleteJobPost(jobPostId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    validateJobPost(dto: ICreateJobPostReq) {
        if (
            !dto.careerId ||
            !dto.provinceId ||
            !dto.jobName ||
            !dto.deadline ||
            !dto.quantity ||
            !dto.jobDescription ||
            !dto.jobRequirement ||
            !dto.benefitsEnjoyed ||
            !dto.salaryMin ||
            !dto.salaryMax ||
            !dto.position ||
            !dto.typeOfWorkPlace ||
            !dto.experience ||
            !dto.academicLevel ||
            !dto.genderRequirement ||
            !dto.jobType ||
            !dto.contactPersonName ||
            !dto.contactPersonEmail ||
            !dto.contactPersonPhone
        ) {
            throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Invalid input")
        }
    }
    async getCompanyJobPosts(params: IGetCompanyJobPostsReqParams): Promise<IPaginationResponse<ICompanyJobPostDto>> {
        try {
            const { page, limit, search, jobPostStatus } = params;
            const companyId = getCurrentUser().companyId;
            if (!companyId) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "Company Id not found");
            }

            const query = this._context.JobPostRepo.createQueryBuilder("job")
                .leftJoin("job.jobPostActivities", "activity")
                .loadRelationCountAndMap("job.activityCount", "job.jobPostActivities")
                .where("job.companyId = :companyId", { companyId });

            if (jobPostStatus) {
                query.andWhere("job.status = :status", { status: jobPostStatus });
            }

            if (search && search.trim() !== "") {
                query.andWhere(
                    new Brackets((qb) => {
                        qb.where("job.jobName ILIKE :search", { search: `%${search}%` })

                    })
                );
            }

            const totalItems = await query.getCount();
            const jobPosts = await query
                .orderBy("job.createdAt", "DESC")
                .skip((page - 1) * limit)
                .take(limit)
                .getMany();

            return {
                items: JobPostMapper.toListCompanyJobPostDto(jobPosts),
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            };
        } catch (error) {
            throw error
        }
    }
    async createJobPost(data: ICreateJobPostReq): Promise<JobPost> {
        const dataSource = this._context.getDataSource();
        try {
            this.validateJobPost(data)
            const companyId = getCurrentUser().companyId
            if (!companyId) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "Company Id not found");
            }

            // Check if company has an active package usage
            const packageUsage = await this._context.PackageUsageRepo.findOne({
                where: { companyId }
            });

            if (!packageUsage) {
                throw new HttpException(
                    StatusCodes.BAD_REQUEST,
                    EGlobalError.InvalidInput,
                    "Bạn cần mua gói để đăng tin tuyển dụng"
                );
            }

            // Check if package is not expired
            if (packageUsage.expiryDate && new Date() > packageUsage.expiryDate) {
                throw new HttpException(
                    StatusCodes.BAD_REQUEST,
                    EGlobalError.InvalidInput,
                    "Gói của bạn đã hết hạn. Vui lòng mua gói mới"
                );
            }

            // Check if jobPostRemaining > 0
            if (packageUsage.jobPostRemaining <= 0) {
                throw new HttpException(
                    StatusCodes.BAD_REQUEST,
                    EGlobalError.InvalidInput,
                    "Bạn đã hết lượt đăng tin. Vui lòng mua gói mới"
                );
            }

            return await dataSource.transaction(async (manager) => {
                // Create job post with dates
                const newJobPost = this._context.JobPostRepo.create(JobPostMapper.toCreateJobPostEntity(data, companyId));

                // Set expiredAt based on jobPostDurationInDays
                const expiredAt = new Date();
                expiredAt.setDate(expiredAt.getDate() + packageUsage.jobPostDurationInDays);
                newJobPost.expiredAt = expiredAt;

                console.log(`expired At ${packageUsage.jobPostDurationInDays}`);

                

                // Set hotExpiredAt based on jobHotDurationInDays
                const hotExpiredAt = new Date();
                hotExpiredAt.setDate(hotExpiredAt.getDate() + packageUsage.jobHotDurationInDays);
                newJobPost.hotExpiredAt = hotExpiredAt;

                await manager.save(newJobPost);

                // Decrement jobPostRemaining
                packageUsage.jobPostRemaining -= 1;
                await manager.save(packageUsage);

                return newJobPost;
            });
        } catch (error) {
            throw error
        }
    }
    async updateJobPost(data: IUpdateJobPostReq): Promise<JobPost> {
        try {
            const currentJobPost = await this._context.JobPostRepo.findOne({
                where: { id: data.id }
            })
            if (!currentJobPost) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "Job post not found");
            }
            const updateJobPostDto = JobPostMapper.toUpdateJobPostEntity(data)
            const updatedJobPost = this._context.JobPostRepo.merge(currentJobPost, updateJobPostDto)
            await this._context.JobPostRepo.save(updatedJobPost)
            return updatedJobPost
        } catch (error) {
            throw error
        }
    }

    async updateJobPostStatus(jobPostId: number, status: number): Promise<JobPost> {
        try {
            const jobPost = await this._context.JobPostRepo.findOne({
                where: { id: jobPostId },
                relations: ['company', 'company.user']
            });
            if (!jobPost) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Job post not found");
            }

            // Validate status
            if (!Object.values(EJobPostStatus).includes(status)) {
                throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Invalid status");
            }

            const oldStatus = jobPost.status;
            jobPost.status = status;
            await this._context.JobPostRepo.save(jobPost);

            // Create notification for employer when job post is approved or rejected
            if (oldStatus !== status && jobPost.company?.user) {
                let notificationType: NotificationType;
                let title: string;
                let message: string;

                if (status === EJobPostStatus.APPROVED) {
                    notificationType = NotificationType.JOB_POST_APPROVED;
                    title = "Tin tuyển dụng đã được duyệt";
                    message = `Tin tuyển dụng "${jobPost.jobName}" của bạn đã được phê duyệt và hiển thị công khai.`;
                } else if (status === EJobPostStatus.REJECTED) {
                    notificationType = NotificationType.JOB_POST_REJECTED;
                    title = "Tin tuyển dụng bị từ chối";
                    message = `Tin tuyển dụng "${jobPost.jobName}" của bạn không được phê duyệt. Vui lòng kiểm tra lại nội dung.`;
                }

                if (notificationType) {
                    const notification = this._context.NotificationRepo.create({
                        userId: jobPost.company.user.id,
                        type: notificationType,
                        title,
                        message,
                        metadata: { jobPostId: jobPost.id, jobName: jobPost.jobName }
                    });
                    await this._context.NotificationRepo.save(notification);

                    const io = SocketService.getIO();
                    if (io) {
                        io.to(`user:${jobPost.company.user.id}`).emit('notification', notification);
                    }
                }
            }

            return jobPost;
        } catch (error) {
            throw error;
        }
    }

    async getSavedJobPosts(): Promise<IJobPostDto[]> {
        try {
            const user = getCurrentUser();
            if (!user) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "Candidate Id not found");
            }

            const candidateId = user.candidateId;
            if (!candidateId || isNaN(candidateId)) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "Candidate Id not found");
            }

            const jobPosts = await this._context.JobPostRepo
                .createQueryBuilder("job")
                .select([
                    "job.id",
                    "job.jobName",
                    "job.salaryMin",
                    "job.salaryMax",
                    "job.provinceId",
                    "job.createdAt",
                    "job.hotExpiredAt",
                    "job.deadline"
                ])
                .innerJoinAndSelect("job.savedJobPosts", "savedJobPost", "savedJobPost.candidateId = :candidateId", { candidateId })
                .leftJoinAndSelect("job.company", "company")
                .leftJoinAndSelect("company.companyImages", "companyImage")
                .leftJoinAndSelect("companyImage.image", "image", "image.fileType = :fileType AND image.deletedAt IS NULL", { fileType: FileType.LOGO })
                .leftJoinAndSelect("job.jobPostActivities", "jobPostActivity", "jobPostActivity.candidateId = :candidateId", { candidateId })
                .orderBy("job.createdAt", "DESC")
                .getMany();

            return JobPostMapper.toListJobPostDto(jobPosts, candidateId);
        } catch (error) {
            throw error;
        }
    }

}