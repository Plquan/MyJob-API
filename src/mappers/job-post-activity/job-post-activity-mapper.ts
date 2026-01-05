import { EJobPostActivityStatus } from "@/common/enums/job/EJobPostActivity";
import { JobPostActivity } from "@/entities/job-post-activity";
import { IApplyJobRequest, IJobPostActivityDto } from "@/interfaces/job-post-activity/job-post-activity-dto";
import { ResumeMapper } from "../resume/resume-mapper";


export class JobPostActivityMapper {
    public static toJobPostActivitiyFromCreate(request: IApplyJobRequest, candidateId: number): JobPostActivity {
        const activity = new JobPostActivity();
        activity.jobPostId = request.jobPostId;
        activity.resumeId = request.resumeId;
        activity.candidateId = candidateId;
        activity.fullName = request.fullName;
        activity.email = request.email;
        activity.phone = request.phone;
        activity.status = EJobPostActivityStatus.PENDING;
        activity.isSentMail = false;
        activity.isDeleted = false;
        return activity;
    }

    public static toJobPostActivityDto(entity: JobPostActivity): IJobPostActivityDto {
        return {
            id: entity.id,
            jobPostId: entity.jobPostId,
            resumeId: entity.resumeId,
            candidateId: entity.candidateId,
            fullName: entity.fullName,
            email: entity.email,
            phone: entity.phone,
            status: entity.status,
            isSentMail: entity.isSentMail,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            resume: entity.resume
                ? ResumeMapper.toResumeDto(entity.resume)
                : undefined,
        };
    }
    public static toListJobPostActivityDto(entities: JobPostActivity[]): IJobPostActivityDto[] {
        if (!entities || entities.length === 0) return [];
        return entities.map(entity =>
            this.toJobPostActivityDto(entity)
        );
    }

}
