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
  jobType: EJobType;
  isHot: boolean;
  isUrgent: boolean;
  isActive: boolean;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
}