import { CreateJobPostRequest } from "@/dtos/job/create-job-post-request";
import { UpdateJobPostRequest } from "@/dtos/job/update-job-post-request";
import { JobPost } from "@/entities/job-post";

export  default interface IJobPostService {
    getAllJobPosts(): Promise<JobPost[]>
    CreateJobPost(data: CreateJobPostRequest,userId: number): Promise<JobPost>
    UpdateJobPost(data: UpdateJobPostRequest): Promise<JobPost>
}