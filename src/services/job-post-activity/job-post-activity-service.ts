import { EGlobalError } from "@/common/enums/error/EGlobalError";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { getCurrentUser } from "@/common/helpers/get-current-user";
import { HttpException } from "@/errors/http-exception";
import IJobPostActivityService from "@/interfaces/job-post-activity/job-post-activity-interface";
import DatabaseService from "../common/database-service";
import { JobPostActivityMapper } from "@/mappers/job-post-activity/job-post-activity-service";
import { IApplyJobRequest, IGetJobPostActivityRequest, IJobPostActivityDto } from "@/interfaces/job-post-activity/job-post-activity-dto";
import { IPaginationResponse } from "@/interfaces/base/IPaginationBase";

export default class JobPostActivityService implements IJobPostActivityService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
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
            const newJobPostActivity = JobPostActivityMapper.toJobPostActivitiyFromCreate(request, user.candidateId)
            await this._context.JobPostActivityRepo.save(newJobPostActivity);
            return true
        } catch (error) {
            throw error
        }
    }

}