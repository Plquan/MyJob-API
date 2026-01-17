import { IPaginationResponse } from "../base/IPaginationBase"
import { IAppliedJobDto, IApplyJobRequest, IGetAppliedJobsRequest, IGetJobPostActivityRequest, IJobPostActivityDto, ISendEmailToActivityRequest, updateJobPostActivityStatusRequest } from "./job-post-activity-dto"

export default interface IJobPostActivityService {
    applyJob(request: IApplyJobRequest): Promise<boolean>
    getJobPostActivities(request: IGetJobPostActivityRequest): Promise<IPaginationResponse<IJobPostActivityDto>>
    deleteJobPostActivity(jobPostActivityId: number): Promise<boolean>
    sendEmailToCandidate(jobPostActivityId: number | null, request: ISendEmailToActivityRequest): Promise<boolean>
    updateJobPostActivityStatus(request: updateJobPostActivityStatusRequest): Promise<boolean>
    getCandidateAppliedJobs(request: IGetAppliedJobsRequest): Promise<IPaginationResponse<IAppliedJobDto>>
}