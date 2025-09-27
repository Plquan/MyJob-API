import { IMyJobFileDto } from "../myjobfile/myjobfile-dto";


export interface ICompanyDto {
  id: number;
  provinceId?: number;
  districtId?: number;
  userId: number;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  websiteUrl?: string;
  youtubeUrl?: string;
  linkedInUrl?: string;
  facebookUrl?: string;
  taxCode: string;
  since?: Date;
  fieldOperation?: string;
  description?: string;
  employeeSize?: number;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICompanyWithImagesDto {
  company: ICompanyDto
  images?: IMyJobFileDto[];
}


export interface IUpdateCompanyRequest {
  id: number;
  provinceId: number;
  districtId: number;
  userId: number;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  websiteUrl?: string;
  youtubeUrl?: string;
  linkedInUrl?: string;
  facebookUrl?: string;
  taxCode: string;
  since?: Date;
  fieldOperation?: string;
  description?: string;
  employeeSize?: number;
  address: string;
}

