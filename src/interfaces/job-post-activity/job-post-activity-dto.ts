import { EJobPostActivityStatus } from "@/common/enums/job/EJobPostActivity";
import { IResumeDto } from "@/dtos/resume/resume-dto";
import { IJobPostDto } from "../job-post/job-post-dto";

export interface IJobPostActivityDto {
    id: number;
    jobPostId: number;
    resumeId?: number;
    candidateId: number;
    fullName?: string;
    email?: string;
    phone?: string;
    status: number;
    isSentMail: boolean;
    createdAt: Date;
    updatedAt: Date;
    resume?: IResumeDto;
}
export interface IGetJobPostActivityRequest {
    page: number
    limit: number
    search?: string
    status: EJobPostActivityStatus
}

export interface IApplyJobRequest {
    jobPostId: number;
    resumeId: number;
    fullName: string;
    email: string;
    phone: string;
}

export interface ISendEmailToActivityRequest {
    to: string;
    subject: string;
    content: string;
}

export interface updateJobPostActivityStatusRequest {
    jobPostActivityId: number
    status: EJobPostActivityStatus
}

export interface IAppliedJobDto {
    id: number;
    jobPostId: number;
    candidateId: number;
    fullName?: string;
    email?: string;
    phone?: string;
    status: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    jobPost: IJobPostDto;
}

export interface IGetAppliedJobsRequest {
    page: number;
    limit: number;
    status?: EJobPostActivityStatus;
}