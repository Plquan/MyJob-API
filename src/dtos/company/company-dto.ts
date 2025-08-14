import { Expose, Type } from 'class-transformer';

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
}
