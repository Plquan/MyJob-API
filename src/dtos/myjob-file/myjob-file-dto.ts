import { Expose, Type } from 'class-transformer';

export class MyJobFileDto {
  @Expose()
  id!: number;

  @Expose()
  publicId!: string;

  @Expose()
  url!: string;

  @Expose()
  fileType!: string;

  @Expose()
  resourceType!: string;

  @Expose()
  format!: string;

  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @Expose()
  @Type(() => Date)
  updatedAt!: Date;
}
