import { 
  IStatsDto, 
  IUserChartDataDto, 
  IJobPostChartDataDto, 
  ITopCareerDto, 
  IApplicationChartDataDto, 
  IRevenuePackageChartDataDto,
  IDashboardStatsDto 
} from "@/dtos/statistics/statistics-dto";

export default interface IStatisticsService {
  getStats(startDate?: Date, endDate?: Date): Promise<IStatsDto>;
  getUserChart(startDate?: Date, endDate?: Date): Promise<IUserChartDataDto[]>;
  getJobPostChart(startDate?: Date, endDate?: Date): Promise<IJobPostChartDataDto[]>;
  getTopCareers(startDate?: Date, endDate?: Date): Promise<ITopCareerDto[]>;
  getApplicationChart(startDate?: Date, endDate?: Date): Promise<IApplicationChartDataDto[]>;
  getRevenuePackageChart(startDate?: Date, endDate?: Date): Promise<IRevenuePackageChartDataDto[]>;
  getDashboardStats(startDate?: Date, endDate?: Date): Promise<IDashboardStatsDto>;
}

