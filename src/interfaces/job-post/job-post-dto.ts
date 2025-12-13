import { EGender } from "@/common/enums/candidate/candidate-enum";
import { EJobPostStatus } from "@/common/enums/job/EJobPostStatus";
import { EAcademicLevel, EExperience, EJobType, EPosition, ETypeOfWorkplace } from "@/common/enums/resume/resume-enum";

export interface ICreateJobPostReq {
  careerId: number;
  provinceId: number;
  jobName: string;
  deadline: Date;
  quantity: number;
  jobDescription: string;
  jobRequirement: string;
  benefitsEnjoyed: string;
  salaryMin: number;
  salaryMax: number;
  position: EPosition;
  typeOfWorkPlace: ETypeOfWorkplace;
  experience: EExperience;
  academicLevel: EAcademicLevel;
  genderRequirement: EGender;
  jobType: EJobType;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
}

export interface IUpdateJobPostReq extends Partial<ICreateJobPostReq> {
  id: number;
}

export interface ICompanyJobPostDto {
  id: number;
  careerId: number;
  companyId: number;
  provinceId: number;
  jobName: string;
  deadline?: Date;
  quantity?: number;
  jobDescription?: string;
  jobRequirement?: string;
  benefitsEnjoyed?: string;
  salaryMin: number;
  salaryMax: number;
  position: EPosition;
  typeOfWorkPlace: ETypeOfWorkplace;
  experience: EExperience;
  academicLevel: EAcademicLevel;
  genderRequirement: EGender;
  jobType: EJobType;
  isHot: boolean;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  views: number;
  applications: number;
  createdAt: Date;
  updatedAt: Date;
  status: EJobPostStatus;
}

export interface IJobPostWithImageDto {
  id: number;
  jobName: string;
}

export interface IGetCompanyJobPostsReqParams {
  page: number
  limit: number
  search: string
  jobPostStatus: EJobPostStatus
}

export interface IGetJobPostsReqParams {
  page: number
  limit: number

  jobName?: string
  careerId?: number
  provinceId?: number
  jobType?: EJobType;
  experience?: EExperience;
  academicLevel?: EAcademicLevel;
  rangeSalary?: {
    salaryMin: number
    salaryMax: number
  },
}

export interface IJobPostDto {
  id: number
  jobName: string
  provinceId: number
  company: {
    companyName: string
    logo?: string
    coverImage?: string
    images: string[]
  }
  isSaved: boolean
  isApplied: boolean
  isNew: boolean
  deadline?: Date;
  quantity?: number;
  jobDescription?: string;
  jobRequirement?: string;
  benefitsEnjoyed?: string;
  salaryMin: number;
  salaryMax: number;
  position: EPosition;
  typeOfWorkPlace: ETypeOfWorkplace;
  experience: EExperience;
  academicLevel: EAcademicLevel;
  genderRequirement: EGender;
  jobType: EJobType;
  isHot: boolean;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  views: number;
  applications: number;
  createdAt: Date;
  updatedAt: Date;
  status: EJobPostStatus;
}


export interface IApplyJobRequest {
  jobPostId: number;
  resumeId: number;
  fullName: string;
  email: string;
  phone: string;
}
