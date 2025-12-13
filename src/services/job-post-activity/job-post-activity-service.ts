import { EGlobalError } from "@/common/enums/error/EGlobalError";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { getCurrentUser } from "@/common/helpers/get-current-user";
import { HttpException } from "@/errors/http-exception";
import IJobPostActivityService from "@/interfaces/job-post-activity/job-post-activity-interface";
import { IApplyJobRequest } from "@/interfaces/job-post/job-post-dto";
import DatabaseService from "../common/database-service";
import { JobPostActivityMapper } from "@/mappers/job-post-activity/job-post-activity-service";

export default class JobPostActivityService implements IJobPostActivityService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
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
            const newJobPostActivity = JobPostActivityMapper.toJobPostActivitiyFromCreate(request,user.candidateId)
            await this._context.JobPostActivityRepo.save(newJobPostActivity);
            return true
        } catch (error) {
            throw error
        }
    }

}