import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateAttachedResumeRequest {
  @IsNumber()
  @IsDefined()
  id: number;

  @IsNumber()
  @IsDefined()
  provinceId: number;

  @IsNumber()
  @IsDefined()
  careerId: number;

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
}
