import { EPosition, ETypeOfWorkplace, EExperience, EAcademicLevel, EJobType, EResumeType } from "@/common/enums/resume/resume-enum";
import { ICandidateDto } from "../candidate/candidate-dto";
import { IEducationDto } from "../education/education-dto";
import { ICertificateDto } from "../certificate/certificate-dto";
import { IExperienceDto } from "../experience/experience-dto";
import { ILanguageDto } from "../language/language-dto";
import { ISkillDto } from "../skill/skill-dto";

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
  createdAt: Date;
  updatedAt: Date;
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
