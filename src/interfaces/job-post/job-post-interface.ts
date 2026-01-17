import { JobPost } from "@/entities/job-post";
import { ICompanyJobPostDto, ICreateJobPostReq, IGetCompanyJobPostsReqParams, IGetJobPostsReqParams, IJobPostDto, IUpdateJobPostReq } from "./job-post-dto";
import { IPaginationResponse } from "../base/IPaginationBase";

export default interface IJobPostService {
    getCompanyJobPosts(req: IGetCompanyJobPostsReqParams): Promise<IPaginationResponse<ICompanyJobPostDto>>
    createJobPost(data: ICreateJobPostReq): Promise<JobPost>
    updateJobPost(data: IUpdateJobPostReq): Promise<JobPost>
    deleteJobPost(jobPostId: number): Promise<boolean>
    getJobPosts(params: IGetJobPostsReqParams): Promise<IPaginationResponse<IJobPostDto>>
    toggleSaveJobPost(jobPostId: number): Promise<boolean>
    getJobPostById(jobPostId: number): Promise<IJobPostDto>
    getSavedJobPosts(): Promise<IJobPostDto[]>
    getAllJobPost(params: IGetCompanyJobPostsReqParams): Promise<IPaginationResponse<ICompanyJobPostDto>>
    updateJobPostStatus(jobPostId: number, status: number): Promise<JobPost>
}