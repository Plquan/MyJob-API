import { IApplyJobRequest } from "../job-post/job-post-dto";

export default interface IJobPostActivityService {
    applyJob(request: IApplyJobRequest): Promise<boolean>
}