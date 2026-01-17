import { ICompanyJobPostDto } from "../job-post/job-post-dto";
import { IMyJobFileDto } from "../myjobfile/myjobfile-dto";


export interface ICompanyDto {
  id: number;
  provinceId?: number;
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

export interface IGetCompaniesReqParams {
  page: number;
  limit: number;
  companyName?: string;
  provinceId?: number;
}

export interface ICompanyStatistics {
  totalJobPosts: number;
  pendingJobPosts: number;
  expiredJobPosts: number;
  totalApplications: number;
  applicationsByStatus: IApplicationByStatus[];
  applicationsMonthly: IApplicationMonthly[];
}

export interface IApplicationByStatus {
  status: number;
  statusName: string;
  count: number;
}

export interface IApplicationMonthly {
  month: string;
  year2024: number;
  year2023: number;
}

export interface IGetEmployerStatisticsRequest {
  startDate?: string;
  endDate?: string;
}
