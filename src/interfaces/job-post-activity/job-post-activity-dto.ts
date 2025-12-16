import { EJobPostActivityStatus } from "@/common/enums/job/EJobPostActivity";
import { IResumeDto } from "@/dtos/resume/resume-dto";

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

