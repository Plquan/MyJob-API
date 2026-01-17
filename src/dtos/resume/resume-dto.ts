import { EPosition, ETypeOfWorkplace, EExperience, EAcademicLevel, EJobType, EResumeType } from "@/common/enums/resume/resume-enum";
import { EGender, EMartialStatus } from "@/common/enums/candidate/candidate-enum";
import { ICandidateDto } from "../candidate/candidate-dto";
import { IEducationDto } from "../education/education-dto";
import { ICertificateDto } from "../certificate/certificate-dto";
import { IExperienceDto } from "../experience/experience-dto";
import { ILanguageDto } from "../language/language-dto";
import { ISkillDto } from "../skill/skill-dto";
import { IMyJobFileDto } from "@/interfaces/myjobfile/myjobfile-dto";

export interface IResumeDto {
  id: number;
  candidateId: number;
  careerId?: number;
  provinceId?: number;
  myJobFileId?: number;
  title?: string;
  description?: string;
  salaryMin?: number;
  salaryMax?: number;
  position?: EPosition;
  typeOfWorkPlace?: ETypeOfWorkplace;
  experience?: EExperience;
  academicLevel?: EAcademicLevel;
  jobType?: EJobType;
  type: EResumeType;
  selected: boolean;
  isSaved?: boolean;
  createdAt: Date;
  updatedAt: Date;
  myJobFile?: IMyJobFileDto;
  candidate?: ICandidateDto;
}

export interface IOnlineResumeDto {
  resume: IResumeDto
  candidate?: ICandidateDto;
  educations?: IEducationDto[];
  certificates?: ICertificateDto[];
  experiences?: IExperienceDto[];
  languages?: ILanguageDto[];
  skills?: ISkillDto[];
}


export interface UploadAttachedResumeRequest {
  provinceId: number;
  careerId: number;
  candidateId: number;
  myJobFileId: number;
  title: string;
  description: string;
  salaryMin: number;
  salaryMax: number;
  position: number;
  typeOfWorkPlace: number;
  experience: number;
  academicLevel?: number;
  jobType: number;
  type: EResumeType;
}

export interface UpdateAttachedResumeRequest {
  id: number;
  provinceId: number;
  careerId: number;
  title?: string;
  description?: string;
  salaryMin?: number;
  salaryMax?: number;
  position?: number;
  typeOfWorkPlace?: number;
  experience?: number;
  academicLevel?: number;
  jobType?: number;
}

export interface ISearchResumesReqParams {
  page: number;
  limit: number;
  title?: string;
  candidateName?: string;
  provinceId?: number;
  careerId?: number;
  position?: EPosition;
  typeOfWorkPlace?: ETypeOfWorkplace;
  experience?: EExperience;
  academicLevel?: EAcademicLevel;
  jobType?: EJobType;
}