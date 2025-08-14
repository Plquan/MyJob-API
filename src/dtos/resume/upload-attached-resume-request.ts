import { VariableSystem } from '@/common/constants/VariableSystem';
import { IsNumber, IsOptional, IsString, IsDefined, Min, Max } from 'class-validator';

export class UploadAttachedResumeRequest {
  @IsNumber()
  @IsDefined()
  provinceId: number;

  @IsNumber()
  @IsDefined()
  careerId: number;

  @IsNumber()
  @IsOptional()
  candidateId?: number;

  @IsNumber()
  @IsOptional()
  myJobFileId?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  salaryMin?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  salaryMax?: number;

  @IsNumber()
  @IsOptional()
  position?: number;

  @IsNumber()
  @IsOptional()
  typeOfWorkPlace?: number;

  @IsNumber()
  @IsOptional()
  experience?: number;

  @IsNumber()
  @IsOptional()
  academicLevel?: number;

  @IsNumber()
  @IsOptional()
  jobType?: number;

  @IsString()
  @IsOptional()
  type: string = VariableSystem.CV_TYPE.CV_ATTACHED;

}
