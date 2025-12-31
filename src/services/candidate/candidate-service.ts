import { LocalStorage } from "@/common/constants/local-storage";
import { IResponseBase } from "@/interfaces/base/IResponseBase";
import ICandidateService from "@/interfaces/candidate/candidate-interface";
import DatabaseService from "../common/database-service";
import logger from "@/common/helpers/logger";
import { ErrorMessages } from "@/common/constants/ErrorMessages";
import { VariableSystem } from "@/common/constants/VariableSystem";
import { User } from "@/entities/user";
import { EntityManager, Between, In } from "typeorm";
import { ICandidateData } from "@/dtos/candidate/candidate-dto";
import { RequestStorage } from "@/common/middlewares/async-local-storage";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { EResumeType } from "@/common/enums/resume/resume-enum";
import { IUserActivityStatistics, IMonthlyActivity } from "@/interfaces/candidate/candidate-statistics-interface";
import { EJobPostStatus } from "@/common/enums/job/EJobPostStatus";
import JobPostMapper from "@/mappers/job-post/job-post-mapper";
import { FileType } from "@/common/enums/file-type/file-types";

export default class CandidateService implements ICandidateService {

    private readonly _context: DatabaseService

    constructor(DatabaseService:DatabaseService){
        this._context = DatabaseService
    }
    async getProfile(): Promise<IResponseBase> {
      try {
        const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
        const userId = request?.user?.id;

        if (!userId) {
          return {
            status: StatusCodes.UNAUTHORIZED,
            success: false,
            message: "Bạn không có quyền truy cập"
          }
        }

        const candidateProfile = await this._context.CandidateRepo.findOne({
          where: { userId },
          relations: ['province'],
         })


        if(!candidateProfile){
           return {
            status: StatusCodes.NOT_FOUND,
            success:false,
            message:"Không tìm thấy hồ sơ ứng viên"
           }
        }

        return {
          status: StatusCodes.OK,
          success:true,
          message:"Lấy thông tin ứng viên thành công",
          data:candidateProfile
        }
        
      } catch (error) {
        throw error
      }
    }
    async updateProfile(data: ICandidateData): Promise<IResponseBase> {
      try {
        const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
        const userId = request?.user?.id;

        if (!userId) {
          return {
            status: StatusCodes.UNAUTHORIZED,
            success: false,
            message: "Bạn không có quyền truy cập"
          }
        }

         const candidateProfile =  await this._context.CandidateRepo.findOne({ where: { userId } })

        if (!candidateProfile) {
          return {
            status: StatusCodes.NOT_FOUND,
            success: false,
            message: "Không tìm thấy thông tin người dùng"
          }
        }

        this._context.CandidateRepo.merge(candidateProfile, {
          provinceId: data.provinceId,
          phone: data.phone,
          birthday: data.birthday,
          gender: data.gender,
          maritalStatus: data.maritalStatus,
          address: data.address,
        })

        await this._context.CandidateRepo.save(candidateProfile)

        const updatedProfile = await this._context.CandidateRepo.findOne({
            where: { id: candidateProfile.id },
            relations: ['province'],
          })

        return {
          status: StatusCodes.OK,
          success: true,
          message: "Cập nhật thông tin thành công",
          data: updatedProfile
        }

      } catch (error) {
        logger.error(error?.message);
        console.error(`Error in CandidateService - updateCandidateProfile() at ${new Date().toISOString()} - ${error?.message}`);
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi cập nhật thông tin người dùng, vui lòng thử lại sau",
        }
      }
    }
    async createProfile(user: User,manager: EntityManager): Promise<IResponseBase> {
        try {

         const newCandidateProfile = await manager.save(
            this._context.CandidateRepo.create({ user })
          );

          await manager.save(
            this._context.ResumeRepo.create({
              candidate: newCandidateProfile,
              selected:true,
              type: EResumeType.ONLINE,
            })
          )

          return {
            status: StatusCodes.CREATED,
            success: true,
            message: "Tạo hồ sơ ứng viên thành công",
          };
        } catch (error: any) {
          logger.error(error?.message);
          console.log(`Error in CandidateService - method createCandidateProfile() at ${new Date().getTime()} with message ${error?.message}`);

          return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: ErrorMessages.INTERNAL_SERVER_ERROR,
          }
        }
    }
    async allowSearch(status: boolean): Promise<IResponseBase> {
    try {
       const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
        const userId = request?.user?.id;

        if (!userId) {
          return {
            status: StatusCodes.UNAUTHORIZED,
            success: false,
            message: "Bạn không có quyền truy cập"
          }
        }

        const candidate = await this._context.CandidateRepo.findOne({
          where: {userId}
        })

        if(!candidate){
          return {
             status: StatusCodes.NOT_FOUND,
             success: false,
             message: "Không tìm thấy hồ sơ"
          }
        }

        candidate.allowSearch = status
        await this._context.CandidateRepo.save(candidate)

        return {
          status: StatusCodes.OK,
          success: true,
          message: "Cập nhật thành công"
        }
      
     } catch (error) {
       logger.error(error?.message);
          console.log(`Error in CandidateService - method createCandidateProfile() at ${new Date().getTime()} with message ${error?.message}`);

          return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Lỗi hệ thống, vui lòng thử lại sau",
          }
      }
    } 

    async getUserActivityStatistics(): Promise<IResponseBase> {
      try {
        const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
        const userId = request?.user?.id;

        if (!userId) {
          return {
            status: StatusCodes.UNAUTHORIZED,
            success: false,
            message: "Bạn không có quyền truy cập"
          }
        }

        const candidate = await this._context.CandidateRepo.findOne({
          where: { userId }
        });

        if (!candidate) {
          return {
            status: StatusCodes.NOT_FOUND,
            success: false,
            message: "Không tìm thấy hồ sơ ứng viên"
          }
        }

        // Get total counts
        const appliedJobsCount = await this._context.JobPostActivityRepo.count({
          where: { candidateId: candidate.id, isDeleted: false }
        });

        const savedJobsCount = await this._context.SavedJobPostRepo.count({
          where: { candidateId: candidate.id }
        });

        const followedCompaniesCount = await this._context.FollowedCompanyRepo.count({
          where: { candidateId: candidate.id }
        });

        // Get monthly activity data for the last 12 months
        const currentDate = new Date();
        const monthlyActivity: IMonthlyActivity[] = [];

        for (let i = 11; i >= 0; i--) {
          const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
          
          const monthStr = `T${monthDate.getMonth() + 1}-${monthDate.getFullYear()}`;

          // Count applied jobs in this month
          const appliedInMonth = await this._context.JobPostActivityRepo.count({
            where: {
              candidateId: candidate.id,
              isDeleted: false,
              createdAt: Between(monthDate, nextMonthDate)
            }
          });

          // Count saved jobs in this month
          const savedInMonth = await this._context.SavedJobPostRepo.count({
            where: {
              candidateId: candidate.id,
              createdAt: Between(monthDate, nextMonthDate)
            }
          });

          // Count followed companies in this month
          const followedInMonth = await this._context.FollowedCompanyRepo.count({
            where: {
              candidateId: candidate.id,
              createdAt: Between(monthDate, nextMonthDate)
            }
          });

          monthlyActivity.push({
            month: monthStr,
            appliedJobs: appliedInMonth,
            savedJobs: savedInMonth,
            followedCompanies: followedInMonth
          });
        }

        const statistics: IUserActivityStatistics = {
          appliedJobs: appliedJobsCount,
          savedJobs: savedJobsCount,
          followedCompanies: followedCompaniesCount,
          monthlyActivity
        };

        return {
          status: StatusCodes.OK,
          success: true,
          message: "Lấy thống kê hoạt động thành công",
          data: statistics
        };

      } catch (error) {
        logger.error(error?.message);
        console.error(`Error in CandidateService - getUserActivityStatistics() at ${new Date().toISOString()} - ${error?.message}`);
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi lấy thống kê hoạt động, vui lòng thử lại sau",
        }
      }
    }

    async getRecommendedJobs(limit: number = 10): Promise<IResponseBase> {
      try {
        const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
        const userId = request?.user?.id;

        if (!userId) {
          return {
            status: StatusCodes.UNAUTHORIZED,
            success: false,
            message: "Bạn không có quyền truy cập"
          }
        }

        const candidate = await this._context.CandidateRepo.findOne({
          where: { userId }
        });

        if (!candidate) {
          return {
            status: StatusCodes.NOT_FOUND,
            success: false,
            message: "Không tìm thấy hồ sơ ứng viên"
          }
        }

        // Get selected resume with all related data
        const selectedResume = await this._context.ResumeRepo.findOne({
          where: { 
            candidateId: candidate.id, 
            selected: true 
          },
          relations: ['career', 'province', 'skills']
        });

        if (!selectedResume) {
          return {
            status: StatusCodes.OK,
            success: true,
            message: "Chưa có resume được chọn",
            data: []
          }
        }

        // Build query for recommended jobs
        const query = this._context.JobPostRepo.createQueryBuilder("job")
          .leftJoinAndSelect("job.company", "company")
          .leftJoinAndSelect("company.companyImages", "companyImage")
          .leftJoinAndSelect("companyImage.image", "image", "image.fileType = :fileType AND image.deletedAt IS NULL", { fileType: FileType.LOGO })
          .leftJoinAndSelect("job.savedJobPosts", "savedJobPost", "savedJobPost.candidateId = :candidateId", {
            candidateId: candidate.id
          })
          .leftJoinAndSelect(
            "job.jobPostActivities",
            "jobPostActivity",
            "jobPostActivity.candidateId = :candidateId",
            { candidateId: candidate.id }
          )
          .where("job.status = :status", { status: EJobPostStatus.APPROVED })
          .andWhere("job.deadline > :now", { now: new Date() });

        // Add filters to prioritize matching jobs
        let params: any = { candidateId: candidate.id, status: EJobPostStatus.APPROVED, now: new Date() };

        // Prioritize career match
        if (selectedResume.careerId) {
          params.careerId = selectedResume.careerId;
        }

        // Prioritize province match
        if (selectedResume.provinceId) {
          params.provinceId = selectedResume.provinceId;
        }

        query.setParameters(params);

        // Fetch more jobs than needed for scoring
        const jobPosts = await query
          .take(limit * 5) // Fetch 5x more for scoring
          .getMany();

        // Calculate match score for each job in application
        const scoredJobs = jobPosts.map((job) => {
          let score = 0;

          // Match career (highest priority - 40 points)
          if (selectedResume.careerId && job.careerId === selectedResume.careerId) {
            score += 40;
          }

          // Match province (30 points)
          if (selectedResume.provinceId && job.provinceId === selectedResume.provinceId) {
            score += 30;
          }

          // Match position (15 points)
          if (selectedResume.position && job.position === selectedResume.position) {
            score += 15;
          }

          // Match experience level (10 points)
          if (selectedResume.experience && job.experience === selectedResume.experience) {
            score += 10;
          }

          // Match job type (5 points)
          if (selectedResume.jobType && job.jobType === selectedResume.jobType) {
            score += 5;
          }

          // Salary match bonus (5 points)
          if (selectedResume.salaryMin && selectedResume.salaryMax) {
            if (job.salaryMax >= selectedResume.salaryMin && job.salaryMin <= selectedResume.salaryMax) {
              score += 5;
            }
          }

          // Match workplace type (3 points)
          if (selectedResume.typeOfWorkPlace && job.typeOfWorkPlace === selectedResume.typeOfWorkPlace) {
            score += 3;
          }

          // Match academic level (2 points)
          if (selectedResume.academicLevel && job.academicLevel === selectedResume.academicLevel) {
            score += 2;
          }

          return { job, score };
        });

        // Sort by score and get top N
        const topJobs = scoredJobs
          .sort((a, b) => {
            // Sort by score first
            if (b.score !== a.score) {
              return b.score - a.score;
            }
            // If same score, sort by date
            return new Date(b.job.createdAt).getTime() - new Date(a.job.createdAt).getTime();
          })
          .slice(0, limit)
          .map(item => item.job);

        // Map to DTOs
        const recommendedJobs = topJobs.map((job) => 
          JobPostMapper.toJobPosDto(job, candidate.id)
        );

        return {
          status: StatusCodes.OK,
          success: true,
          message: "Lấy danh sách việc làm gợi ý thành công",
          data: recommendedJobs
        };

      } catch (error) {
        logger.error(error?.message);
        console.error(`Error in CandidateService - getRecommendedJobs() at ${new Date().toISOString()} - ${error?.message}`);
        return {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          success: false,
          message: "Lỗi lấy danh sách việc làm gợi ý, vui lòng thử lại sau",
        }
      }
    }
    

    
}