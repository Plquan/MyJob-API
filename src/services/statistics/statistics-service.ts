import IStatisticsService from "@/interfaces/statistics/statistics-interface";
import DatabaseService from "@/services/common/database-service";
import { 
  IStatsDto, 
  IUserChartDataDto, 
  IJobPostChartDataDto, 
  ITopCareerDto, 
  IApplicationChartDataDto, 
  IRevenuePackageChartDataDto,
  IDashboardStatsDto 
} from "@/dtos/statistics/statistics-dto";
import { EUserRole } from "@/common/enums/user/user-role-enum";
import { EJobPostStatus } from "@/common/enums/job/EJobPostStatus";

export default class StatisticsService implements IStatisticsService {
  private readonly _context: DatabaseService;

  constructor(DatabaseService: DatabaseService) {
    this._context = DatabaseService;
  }

  async getStats(startDate?: Date, endDate?: Date): Promise<IStatsDto> {
    try {
      const userRepo = this._context.UserRepo;
      const jobPostRepo = this._context.JobPostRepo;
      const jobPostActivityRepo = this._context.JobPostActivityRepo;
      const packagePurchasesRepo = this._context.PackagePurchasesRepo;

      // Build where conditions
      const userWhere: any = {};
      const jobPostWhere: any = {};
      const activityWhere: any = {};
      const purchaseWhere: any = {};

      if (startDate && endDate) {
        userWhere.createdAt = { $gte: startDate, $lte: endDate };
        jobPostWhere.createdAt = { $gte: startDate, $lte: endDate };
        activityWhere.createdAt = { $gte: startDate, $lte: endDate };
        purchaseWhere.paymentDate = { $gte: startDate, $lte: endDate };
      }

      // Count job seekers (candidates)
      const jobSeekersCount = await userRepo
        .createQueryBuilder('user')
        .where('user.role = :role', { role: EUserRole.CANDIDATE })
        .andWhere(startDate && endDate ? 'user.createdAt BETWEEN :startDate AND :endDate' : '1=1', 
          { startDate, endDate })
        .getCount();

      // Count employers
      const employersCount = await userRepo
        .createQueryBuilder('user')
        .where('user.role = :role', { role: EUserRole.EMPLOYER })
        .andWhere(startDate && endDate ? 'user.createdAt BETWEEN :startDate AND :endDate' : '1=1', 
          { startDate, endDate })
        .getCount();

      // Count job posts
      const jobPostsCount = await jobPostRepo
        .createQueryBuilder('jobPost')
        .where(startDate && endDate ? 'jobPost.createdAt BETWEEN :startDate AND :endDate' : '1=1', 
          { startDate, endDate })
        .getCount();

      // Count applications
      const applicationsCount = await jobPostActivityRepo
        .createQueryBuilder('activity')
        .where(startDate && endDate ? 'activity.createdAt BETWEEN :startDate AND :endDate' : '1=1', 
          { startDate, endDate })
        .getCount();

      // Calculate total revenue from package purchases
      const revenueResult = await packagePurchasesRepo
        .createQueryBuilder('purchase')
        .select('COALESCE(SUM(purchase.price), 0)', 'total')
        .where(startDate && endDate ? 'purchase.paymentDate BETWEEN :startDate AND :endDate' : '1=1', 
          { startDate, endDate })
        .getRawOne();

      return {
        jobSeekers: jobSeekersCount,
        employers: employersCount,
        jobPosts: jobPostsCount,
        applications: applicationsCount,
        revenue: parseFloat(revenueResult?.total || '0'),
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserChart(startDate?: Date, endDate?: Date): Promise<IUserChartDataDto[]> {
    try {
      const userRepo = this._context.UserRepo;

      // Get monthly user registrations
      const query = userRepo
        .createQueryBuilder('user')
        .select("TO_CHAR(user.createdAt, 'YYYY-MM')", 'date')
        .addSelect('user.role', 'role')
        .addSelect('COUNT(*)', 'count')
        .groupBy('date')
        .addGroupBy('role')
        .orderBy('date', 'ASC');

      if (startDate && endDate) {
        query.where('user.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
      }

      const results = await query.getRawMany();

      // Transform data into the required format
      const dataMap = new Map<string, { jobSeeker: number; employer: number }>();

      results.forEach((row: any) => {
        const date = row.date;
        if (!dataMap.has(date)) {
          dataMap.set(date, { jobSeeker: 0, employer: 0 });
        }

        const data = dataMap.get(date)!;
        const count = parseInt(row.count);

        if (row.role === EUserRole.CANDIDATE) {
          data.jobSeeker = count;
        } else if (row.role === EUserRole.EMPLOYER) {
          data.employer = count;
        }
      });

      // Convert map to array and format for display (in thousands)
      return Array.from(dataMap.entries()).map(([date, counts]) => ({
        date,
        jobSeeker: counts.jobSeeker / 1000,
        employer: counts.employer / 1000,
      }));
    } catch (error) {
      throw error;
    }
  }

  async getJobPostChart(startDate?: Date, endDate?: Date): Promise<IJobPostChartDataDto[]> {
    try {
      const jobPostRepo = this._context.JobPostRepo;

      const query = jobPostRepo
        .createQueryBuilder('jobPost')
        .select("TO_CHAR(jobPost.createdAt, 'MM/YYYY')", 'month')
        .addSelect('jobPost.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('month')
        .addGroupBy('status')
        .orderBy('month', 'ASC');

      if (startDate && endDate) {
        query.where('jobPost.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
      }

      const results = await query.getRawMany();

      // Map status codes to Vietnamese labels
      const statusLabels: { [key: number]: string } = {
        [EJobPostStatus.PENDING_APPROVAL]: 'Chờ duyệt',
        [EJobPostStatus.APPROVED]: 'Đã duyệt',
        [EJobPostStatus.REJECTED]: 'Không duyệt',
      };

      return results.map((row: any) => ({
        month: row.month,
        status: statusLabels[row.status] || 'Khác',
        value: parseInt(row.count),
      }));
    } catch (error) {
      throw error;
    }
  }

  async getTopCareers(startDate?: Date, endDate?: Date): Promise<ITopCareerDto[]> {
    try {
      const jobPostRepo = this._context.JobPostRepo;

      const query = jobPostRepo
        .createQueryBuilder('jobPost')
        .leftJoin('jobPost.career', 'career')
        .select('career.name', 'careerName')
        .addSelect('career.id', 'careerId')
        .addSelect('COUNT(jobPost.id)', 'count')
        .groupBy('career.id')
        .addGroupBy('career.name')
        .orderBy('count', 'DESC')
        .limit(5);

      if (startDate && endDate) {
        query.where('jobPost.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
      }

      const results = await query.getRawMany();

      return results.map((row: any) => ({
        type: row.careerName || 'Unknown',
        value: parseInt(row.count),
      }));
    } catch (error) {
      throw error;
    }
  }

  async getApplicationChart(startDate?: Date, endDate?: Date): Promise<IApplicationChartDataDto[]> {
    try {
      const activityRepo = this._context.JobPostActivityRepo;

      const query = activityRepo
        .createQueryBuilder('activity')
        .select("TO_CHAR(activity.createdAt, 'MM/YYYY')", 'month')
        .addSelect('COUNT(*)', 'count')
        .groupBy('month')
        .orderBy('month', 'ASC');

      if (startDate && endDate) {
        query.where('activity.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
      }

      const results = await query.getRawMany();

      // Format for display (in thousands)
      return results.map((row: any) => ({
        month: row.month,
        value: parseInt(row.count) / 1000,
      }));
    } catch (error) {
      throw error;
    }
  }

  async getRevenuePackageChart(startDate?: Date, endDate?: Date): Promise<IRevenuePackageChartDataDto[]> {
    try {
      const purchasesRepo = this._context.PackagePurchasesRepo;

      const query = purchasesRepo
        .createQueryBuilder('purchase')
        .leftJoin('purchase.package', 'package')
        .select('package.name', 'packagename')
        .addSelect('package.id', 'packageid')
        .addSelect('COALESCE(SUM(purchase.price), 0)', 'totalrevenue')
        .groupBy('package.id')
        .addGroupBy('package.name')
        .orderBy('totalrevenue', 'DESC');

      if (startDate && endDate) {
        query.where('purchase.paymentDate BETWEEN :startDate AND :endDate', { startDate, endDate });
      }

      const results = await query.getRawMany();

      return results.map((row: any) => ({
        packageName: row.packagename || 'Unknown',
        revenue: parseFloat(row.totalrevenue || '0'),
      }));
    } catch (error) {
      throw error;
    }
  }

  async getDashboardStats(startDate?: Date, endDate?: Date): Promise<IDashboardStatsDto> {
    try {
      // Fetch all data in parallel for better performance
      const [stats, userChart, jobPostChart, topCareers, applicationChart, revenuePackageChart] = 
        await Promise.all([
          this.getStats(startDate, endDate),
          this.getUserChart(startDate, endDate),
          this.getJobPostChart(startDate, endDate),
          this.getTopCareers(startDate, endDate),
          this.getApplicationChart(startDate, endDate),
          this.getRevenuePackageChart(startDate, endDate),
        ]);

      return {
        stats,
        userChart,
        jobPostChart,
        topCareers,
        applicationChart,
        revenuePackageChart,
      };
    } catch (error) {
      throw error;
    }
  }
}

