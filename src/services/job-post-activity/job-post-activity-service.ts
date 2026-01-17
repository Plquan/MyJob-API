import { EGlobalError } from "@/common/enums/error/EGlobalError";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { getCurrentUser } from "@/common/helpers/get-current-user";
import { HttpException } from "@/errors/http-exception";
import IJobPostActivityService from "@/interfaces/job-post-activity/job-post-activity-interface";
import DatabaseService from "../common/database-service";
import { JobPostActivityMapper } from "@/mappers/job-post-activity/job-post-activity-mapper";
import { IAppliedJobDto, IApplyJobRequest, IGetAppliedJobsRequest, IGetJobPostActivityRequest, IJobPostActivityDto, ISendEmailToActivityRequest, updateJobPostActivityStatusRequest } from "@/interfaces/job-post-activity/job-post-activity-dto";
import { IPaginationResponse } from "@/interfaces/base/IPaginationBase";
import { EmailService } from "../common/email-service";
import JobPostMapper from "@/mappers/job-post/job-post-mapper";
import { FileType } from "@/common/enums/file-type/file-types";
import { NotificationType } from "@/entities/notification";
import { EJobPostActivityStatus } from "@/common/enums/job/EJobPostActivity";
import SocketService from "../common/socket-service";

export default class JobPostActivityService implements IJobPostActivityService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
    }
    async updateJobPostActivityStatus(request: updateJobPostActivityStatusRequest): Promise<boolean> {
        try {
            if (!request.jobPostActivityId || !request.status) {
                throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Invalid input");
            }
            const jobPostActivity = await this._context.JobPostActivityRepo.findOne({
                where: { id: request.jobPostActivityId },
                relations: ['jobPost', 'candidate', 'candidate.user']
            })
            if (!jobPostActivity) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "jobPostActivity not found");
            }

            const oldStatus = jobPostActivity.status;
            jobPostActivity.status = request.status
            await this._context.JobPostActivityRepo.save(jobPostActivity)

            // Create notification for candidate when status changes (except PENDING)
            if (oldStatus !== request.status && request.status !== EJobPostActivityStatus.PENDING && jobPostActivity.candidate?.user) {
                let title: string;
                let message: string;

                switch (request.status) {
                    case EJobPostActivityStatus.INTERVIEWED:
                        title = "Bạn đã được mời phỏng vấn";
                        message = `Hồ sơ ứng tuyển "${jobPostActivity.jobPost.jobName}" của bạn đã được chọn để phỏng vấn.`;
                        break;
                    case EJobPostActivityStatus.ACCEPTED:
                        title = "Hồ sơ được chấp nhận";
                        message = `Chúc mừng! Hồ sơ ứng tuyển "${jobPostActivity.jobPost.jobName}" của bạn đã được chấp nhận.`;
                        break;
                    case EJobPostActivityStatus.REJECTED:
                        title = "Hồ sơ không được chấp nhận";
                        message = `Rất tiếc, hồ sơ ứng tuyển "${jobPostActivity.jobPost.jobName}" của bạn chưa phù hợp lần này.`;
                        break;
                }

                if (title && message) {
                    const notification = this._context.NotificationRepo.create({
                        userId: jobPostActivity.candidate.user.id,
                        type: NotificationType.APPLICATION_STATUS_CHANGED,
                        title,
                        message,
                        metadata: {
                            jobPostActivityId: jobPostActivity.id,
                            jobPostId: jobPostActivity.jobPostId,
                            jobName: jobPostActivity.jobPost.jobName,
                            status: request.status
                        }
                    });
                    await this._context.NotificationRepo.save(notification);

                    // Send via socket
                    const io = SocketService.getIO();
                    if (io) {
                        io.to(`user:${jobPostActivity.candidate.user.id}`).emit('notification', notification);
                    }
                }
            }

            return true
        } catch (error) {
            throw error
        }
    }
    async deleteJobPostActivity(jobPostActivityId: number): Promise<boolean> {
        try {
            if (!jobPostActivityId) {
                throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Invalid input");
            }
            await this._context.JobPostActivityRepo.update(jobPostActivityId, { isDeleted: true });
            return true;
        } catch (error) {
            throw error
        }
    }
    async getJobPostActivities(request: IGetJobPostActivityRequest): Promise<IPaginationResponse<IJobPostActivityDto>> {
        try {
            const user = getCurrentUser();
            if (!user) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "user not found");
            }

            const { page, limit, search, status } = request;

            const qb = this._context.JobPostActivityRepo
                .createQueryBuilder('activity')
                .innerJoin('activity.jobPost', 'jobPost')
                .innerJoin('jobPost.company', 'company')
                .leftJoinAndSelect('activity.resume', 'resume')
                .leftJoinAndSelect('resume.myJobFile', 'myJobFile')
                .where('company.id = :companyId', { companyId: user.companyId })
                .andWhere('activity.isDeleted = false');

            if (status !== undefined) {
                qb.andWhere('activity.status = :status', { status });
            }

            if (search) {
                qb.andWhere(
                    `activity.fullName LIKE :search`,
                    { search: `%${search}%` }
                );
            }

            const totalItems = await qb.getCount();

            const entities = await qb
                .orderBy('activity.createdAt', 'DESC')
                .skip((page - 1) * limit)
                .take(limit)
                .getMany();

            return {
                items: JobPostActivityMapper.toListJobPostActivityDto(entities),
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            };
        } catch (error) {
            throw error;
        }
    }

    async applyJob(request: IApplyJobRequest): Promise<boolean> {
        try {
            if (!request.fullName || !request.email || !request.phone || !request.jobPostId || !request.resumeId) {
                throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "invalid input")
            }
            const user = getCurrentUser()
            if (!user.candidateId) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "user not found")
            }
            const isApplied = await this._context.JobPostActivityRepo.exist({
                where: {
                    jobPostId: request.jobPostId,
                    candidateId: user.candidateId
                }
            });
            if (isApplied) {
                throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "job applied")
            }

            // Get job post with company info
            const jobPost = await this._context.JobPostRepo.findOne({
                where: { id: request.jobPostId },
                relations: ['company', 'company.user']
            });

            const newJobPostActivity = JobPostActivityMapper.toJobPostActivitiyFromCreate(request, user.candidateId)
            await this._context.JobPostActivityRepo.save(newJobPostActivity);

            // Create notification for employer
            if (jobPost?.company?.user) {
                const notification = this._context.NotificationRepo.create({
                    userId: jobPost.company.user.id,
                    type: NotificationType.NEW_APPLICATION,
                    title: "Có ứng viên mới ứng tuyển",
                    message: `${request.fullName} đã ứng tuyển vào vị trí "${jobPost.jobName}".`,
                    metadata: {
                        jobPostActivityId: newJobPostActivity.id,
                        jobPostId: request.jobPostId,
                        candidateName: request.fullName,
                        jobName: jobPost.jobName
                    }
                });
                await this._context.NotificationRepo.save(notification);

                // Send via socket
                const io = SocketService.getIO();
                if (io) {
                    io.to(`user:${jobPost.company.user.id}`).emit('notification', notification);
                }
            }

            return true
        } catch (error) {
            throw error
        }
    }

    async sendEmailToCandidate(jobPostActivityId: number | null, request: ISendEmailToActivityRequest): Promise<boolean> {
        try {
            const user = getCurrentUser();
            if (!user || !user.companyId) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "user not found");
            }

            // Case 1: Có jobPostActivityId -> từ manage-resume, cần kiểm tra quyền và cập nhật isSentMail
            if (jobPostActivityId) {
                const jobPostActivity = await this._context.JobPostActivityRepo.findOne({
                    where: { id: jobPostActivityId },
                    relations: ["jobPost", "jobPost.company", "candidate"]
                });

                if (!jobPostActivity) {
                    throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Job post activity not found");
                }

                // Kiểm tra quyền: chỉ employer của công ty đó mới được gửi mail
                if (jobPostActivity.jobPost.companyId !== user.companyId) {
                    throw new HttpException(StatusCodes.FORBIDDEN, EGlobalError.UnauthorizedAccess, "Forbidden");
                }

                // Gửi email
                await EmailService.sendHtmlEmail(
                    request.to,
                    request.subject,
                    request.content,
                    {
                        useTemplate: true,
                    }
                );

                // Cập nhật trạng thái đã gửi mail
                await this._context.JobPostActivityRepo.update(jobPostActivityId, {
                    isSentMail: true
                });
            } else {
                // Case 2: Không có jobPostActivityId -> từ find-candidate, chỉ gửi email
                await EmailService.sendHtmlEmail(
                    request.to,
                    request.subject,
                    request.content,
                    {
                        useTemplate: true,
                    }
                );
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    async getCandidateAppliedJobs(request: IGetAppliedJobsRequest): Promise<IPaginationResponse<IAppliedJobDto>> {
        try {
            const user = getCurrentUser();
            if (!user || !user.candidateId) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "Candidate not found");
            }

            const { page, limit, status } = request;

            // Query builder - lấy cả những record đã bị soft delete
            const qb = this._context.JobPostActivityRepo
                .createQueryBuilder('activity')
                .leftJoinAndSelect('activity.jobPost', 'jobPost')
                .leftJoinAndSelect('jobPost.company', 'company')
                .leftJoinAndSelect('company.companyImages', 'companyImage')
                .leftJoinAndSelect('companyImage.image', 'image', 'image.fileType = :fileType AND image.deletedAt IS NULL', { fileType: FileType.LOGO })
                .where('activity.candidateId = :candidateId', { candidateId: user.candidateId });

            // Filter by status if provided
            if (status !== undefined) {
                qb.andWhere('activity.status = :status', { status });
            }

            const totalItems = await qb.getCount();

            const activities = await qb
                .orderBy('activity.createdAt', 'DESC')
                .skip((page - 1) * limit)
                .take(limit)
                .getMany();

            // Map to DTO
            const items: IAppliedJobDto[] = activities.map(activity => ({
                id: activity.id,
                jobPostId: activity.jobPostId,
                candidateId: activity.candidateId,
                fullName: activity.fullName,
                email: activity.email,
                phone: activity.phone,
                status: activity.status,
                isDeleted: activity.isDeleted,
                createdAt: activity.createdAt,
                updatedAt: activity.updatedAt,
                jobPost: JobPostMapper.toJobPosDto(activity.jobPost, user.candidateId)
            }));

            return {
                items,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            };
        } catch (error) {
            throw error;
        }
    }

}