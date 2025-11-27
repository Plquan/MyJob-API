import { ICompanyJobPostDto } from "../job-post/job-post-dto";
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
  company: ICompanyDto;
  images?: IMyJobFileDto[];
  isFollowed?: boolean;
}

export interface ICompanyDetail extends ICompanyWithImagesDto {
  jobPosts?: ICompanyJobPostDto[];
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

export interface ICreateFollowedCompany {
  companyId: number
  candidateId: number
}
