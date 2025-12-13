import { JobPost } from "@/entities/job-post";
import { IApplyJobRequest, ICreateJobPostReq, IGetCompanyJobPostsReqParams, IGetJobPostsReqParams, IJobPostDto, IUpdateJobPostReq } from "./job-post-dto";
import { IPaginationResponse } from "../base/IPaginationBase";

export  default interface IJobPostService {
    getCompanyJobPosts(req: IGetCompanyJobPostsReqParams): Promise<IPaginationResponse>
    createJobPost(data: ICreateJobPostReq): Promise<JobPost>
    updateJobPost(data: IUpdateJobPostReq): Promise<JobPost>
    deleteJobPost(jobPostId: number): Promise<boolean>
    getJobPosts(params: IGetJobPostsReqParams): Promise<any>
    toggleSaveJobPost(jobPostId: number): Promise<boolean>
    getJobPostById(jobPostId: number): Promise<IJobPostDto>
}