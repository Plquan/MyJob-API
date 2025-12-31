export interface IPackageDto {
  id: number;
  name: string;
  price: number;
  durationInDays: number;
  jobHotDurationInDays: number;
  highlightCompanyDurationInDays: number;
  candidateSearchLimit: number;
  jobPostLimit: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatePackageRequest {
  name: string;
  price: number;
  durationInDays: number;
  jobHotDurationInDays?: number;
  highlightCompanyDurationInDays?: number;
  candidateSearchLimit?: number;
  jobPostLimit?: number;
  description?: string;
}

export interface IUpdatePackageRequest extends Partial<ICreatePackageRequest> {
  id: number;
  isActive:boolean
}
