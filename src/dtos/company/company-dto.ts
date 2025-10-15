import { Expose, Type } from 'class-transformer';
import { MyJobFileDto } from '../myjob-file/myjob-file-dto';

export class CompanyDto {
  @Expose()
  id!: number;

  @Expose()
  provinceId?: number;

  @Expose()
  userId!: number;

  @Expose()
  companyName!: string;

  @Expose()
  companyEmail!: string;

  @Expose()
  companyPhone!: string;

  @Expose()
  websiteUrl?: string;

  @Expose()
  youtubeUrl?: string;

  @Expose()
  linkedInUrl?: string;

  @Expose()
  facebookUrl?: string;

  @Expose()
  taxCode!: string;

  @Expose()
  since?: Date;

  @Expose()
  fieldOperation?: string;

  @Expose()
  description?: string;

  @Expose()
  employeeSize?: number;

  @Expose()
  address!: string;

  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @Expose()
  @Type(() => Date)
  updatedAt!: Date;

  @Expose()
  @Type(() => MyJobFileDto)
  files?: MyJobFileDto[];
}
