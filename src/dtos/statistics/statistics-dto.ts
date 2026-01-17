export interface IStatsDto {
  jobSeekers: number;
  employers: number;
  jobPosts: number;
  applications: number;
  revenue: number;
}

export interface IUserChartDataDto {
  date: string; // Format: YYYY-MM
  jobSeeker: number;
  employer: number;
}

export interface IJobPostChartDataDto {
  month: string; // Format: MM/YYYY
  status: string;
  value: number;
}

export interface ITopCareerDto {
  type: string;
  value: number;
}

export interface IApplicationChartDataDto {
  month: string; // Format: MM/YYYY
  value: number;
}

export interface IRevenuePackageChartDataDto {
  packageName: string;
  revenue: number;
}

export interface IDashboardStatsDto {
  stats: IStatsDto;
  userChart: IUserChartDataDto[];
  jobPostChart: IJobPostChartDataDto[];
  topCareers: ITopCareerDto[];
  applicationChart: IApplicationChartDataDto[];
  revenuePackageChart: IRevenuePackageChartDataDto[];
}

