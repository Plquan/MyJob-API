import { EJobPostStatus } from '@/common/enums/job/EJobPostStatus';
import { EPosition, ETypeOfWorkplace, EExperience, EAcademicLevel, EJobType } from '@/common/enums/resume/resume-enum';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsEmail,
  IsDateString,
  Min,
} from 'class-validator';

export class UpdateJobPostRequest {
  @IsInt()
  careerId!: number;

  @IsInt()
  companyId!: number;

  @IsInt()
  provinceId!: number;

  @IsInt()
  userId!: number;

  @IsString()
  @IsNotEmpty()
  jobName!: string;

  @IsOptional()
  @IsDateString()
  deadline?: Date;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsString()
  jobDescription?: string;

  @IsOptional()
  @IsString()
  jobRequirement?: string;

  @IsOptional()
  @IsString()
  benefitsEnjoyed?: string;

  @IsNumber()
  @Min(0)
  salaryMin!: number;

  @IsNumber()
  @Min(0)
  salaryMax!: number;

  @IsEnum(EPosition)
  position!: EPosition;

  @IsEnum(ETypeOfWorkplace)
  typeOfWorkPlace!: ETypeOfWorkplace;

  @IsEnum(EExperience)
  experience!: EExperience;

  @IsEnum(EAcademicLevel)
  academicLevel!: EAcademicLevel;

  @IsEnum(EJobType)
  jobType!: EJobType;

  @IsBoolean()
  @IsOptional()
  isHot?: boolean;

  @IsBoolean()
  @IsOptional()
  isUrgent?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  contactPersonName?: string;

  @IsOptional()
  @IsEmail()
  contactPersonEmail?: string;

  @IsOptional()
  contactPersonPhone?: string;

  @IsOptional()
  @IsEnum(EJobPostStatus)
  status?: EJobPostStatus;
}
