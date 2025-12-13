import { JobPostActivity } from "@/entities/job-post-activity";
import { IApplyJobRequest } from "@/interfaces/job-post/job-post-dto";


export class JobPostActivityMapper {
  public static toJobPostActivitiyFromCreate(
    request: IApplyJobRequest,
    candidateId: number,
  ): JobPostActivity {
    const activity = new JobPostActivity();

    activity.jobPostId = request.jobPostId;
    activity.resumeId = request.resumeId;
    activity.candidateId = candidateId;

    activity.fullName = request.fullName;
    activity.email = request.email;
    activity.phone = request.phone;

    activity.status = 0;
    activity.isSentMail = false;
    activity.isDeleted = false;

    return activity;
  }
}
