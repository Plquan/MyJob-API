import { JobPost } from "@/entities/job-post";
import { ICreateJobPostReq, IGetJobPostsReqParams, IUpdateJobPostReq, JobPostDto } from "./job-post-dto";
import { IPaginationResponse } from "../base/IPaginationBase";

export  default interface IJobPostService {
    getCompanyJobPosts(req: IGetJobPostsReqParams): Promise<IPaginationResponse>
    createJobPost(data: ICreateJobPostReq): Promise<JobPost>
    updateJobPost(data: IUpdateJobPostReq): Promise<JobPost>
    deleteJobPost(jobPostId: number): Promise<boolean>
    getJobPosts():Promise<boolean>
}