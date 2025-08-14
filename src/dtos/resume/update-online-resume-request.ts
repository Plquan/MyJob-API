import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateOnlineResumeRequest {
  @IsNumber()
  @IsDefined()
  id: number;

  @IsNumber()
  @IsDefined()
  candidateId: number;

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
  salary_min?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  salary_max?: number;

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
  type?: string;

  @IsBoolean()
  @IsDefined()
  isActive: boolean;
}
