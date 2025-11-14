import { EGender } from "@/common/enums/candidate/candidate-enum";
import { EJobPostStatus } from "@/common/enums/job/EJobPostStatus";
import { EAcademicLevel, EExperience, EJobType, EPosition, ETypeOfWorkplace } from "@/common/enums/resume/resume-enum";

export interface ICreateJobPostReq {
  careerId: number;
  provinceId: number;
  districtId: number;
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

export interface JobPostDto {
  id: number;
  careerId: number;
  companyId: number;
  provinceId: number;
  districtId: number;
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
  isUrgent: boolean;
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

export interface IGetJobPostsReqParams {
  page: number
  limit: number
  search: string
  jobPostStatus: EJobPostStatus
}

export interface IJobPostWithCompany {
  id: number;
  jobName: string;
  salaryMin: number;
  salaryMax: number;
  provinceName: string;
  createdAt: Date;
  company: {
    companyName: string;
    logo?: string;
  };
}