import { IPaginationResponse } from "../base/IPaginationBase"
import { IApplyJobRequest, IGetJobPostActivityRequest, IJobPostActivityDto, ISendEmailToActivityRequest, updateJobPostActivityStatusRequest } from "./job-post-activity-dto"

export default interface IJobPostActivityService {
    applyJob(request: IApplyJobRequest): Promise<boolean>
    getJobPostActivities(request: IGetJobPostActivityRequest): Promise<IPaginationResponse<IJobPostActivityDto>>
    deleteJobPostActivity(jobPostActivityId: number): Promise<boolean>
    getJobActivityById(jobPostActivityId: number): Promise<IJobPostActivityDto>
    sendEmailToCandidate(jobPostActivityId: number | null, request: ISendEmailToActivityRequest): Promise<boolean>
    updateJobPostActivityStatus(request: updateJobPostActivityStatusRequest): Promise<boolean>
}