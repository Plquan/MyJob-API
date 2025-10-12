import { JobPost } from "@/entities/job-post";
import { ICreateJobPostReq, IGetJobPostsReqParams, IUpdateJobPostReq, JobPostDto } from "./job-post-dto";
import { IPaginationResponse } from "../base/IPaginationBase";

export  default interface IJobPostService {
    getCompanyJobPosts(req: IGetJobPostsReqParams): Promise<IPaginationResponse>
    CreateJobPost(data: ICreateJobPostReq): Promise<JobPost>
    UpdateJobPost(data: IUpdateJobPostReq): Promise<JobPost>
}