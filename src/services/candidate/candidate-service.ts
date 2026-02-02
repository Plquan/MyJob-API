import { LocalStorage } from "@/common/constants/local-storage";
import ICandidateService from "@/interfaces/candidate/candidate-interface";
import DatabaseService from "../common/database-service";
import logger from "@/common/helpers/logger";
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
import { ICandidateDto } from "@/dtos/candidate/candidate-dto";
import { IJobPostDto } from "@/interfaces/job-post/job-post-dto";
import { HttpException } from "@/errors/http-exception";
import { EAuthError } from "@/common/enums/error/EAuthError";
import { EGlobalError } from "@/common/enums/error/EGlobalError";

export default class CandidateService implements ICandidateService {

    private readonly _context: DatabaseService

    constructor(DatabaseService:DatabaseService){
        this._context = DatabaseService
    }
    async getProfile(): Promise<ICandidateDto> {
      try {
        const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
        const userId = request?.user?.id;

        if (!userId) {
          throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
        }

        const candidateProfile = await this._context.CandidateRepo.findOne({
          where: { userId },
          relations: ['province'],
         })

        if(!candidateProfile){
          throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy hồ sơ ứng viên");
        }

        return candidateProfile as ICandidateDto;
        
      } catch (error) {
        throw error
      }
    }
    async updateProfile(data: ICandidateData): Promise<ICandidateDto> {
      try {
        const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
        const userId = request?.user?.id;

        if (!userId) {
          throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
        }

         const candidateProfile =  await this._context.CandidateRepo.findOne({ where: { userId } })

        if (!candidateProfile) {
          throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy thông tin người dùng");
        }

        this._context.CandidateRepo.merge(candidateProfile, data)

        await this._context.CandidateRepo.save(candidateProfile)

        const updatedProfile = await this._context.CandidateRepo.findOne({
            where: { id: candidateProfile.id },
            relations: ['province'],
          })

        return updatedProfile as ICandidateDto;

      } catch (error) {
        throw error
      }
    }
    async createProfile(user: User,manager: EntityManager): Promise<ICandidateDto> {
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

          return newCandidateProfile as ICandidateDto;
        } catch (error: any) {
          logger.error(error?.message);
          console.log(`Error in CandidateService - method createCandidateProfile() at ${new Date().getTime()} with message ${error?.message}`);
          throw error;
        }
    }
    async allowSearch(status: boolean): Promise<boolean> {
    try {
       const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
        const userId = request?.user?.id;

        if (!userId) {
          throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
        }

        const candidate = await this._context.CandidateRepo.findOne({
          where: {userId}
        })

        if(!candidate){
          throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy hồ sơ");
        }

        candidate.allowSearch = status
        await this._context.CandidateRepo.save(candidate)

        return candidate.allowSearch;
      
     } catch (error) {
       logger.error(error?.message);
       console.log(`Error in CandidateService - method allowSearch() at ${new Date().getTime()} with message ${error?.message}`);
       throw error;
      }
    } 

    async getUserActivityStatistics(): Promise<IUserActivityStatistics> {
      try {
        const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
        const userId = request?.user?.id;

        if (!userId) {
          throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
        }

        const candidate = await this._context.CandidateRepo.findOne({
          where: { userId }
        });

        if (!candidate) {
          throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy hồ sơ ứng viên");
        }

        const appliedJobsCount = await this._context.JobPostActivityRepo.count({
          where: { candidateId: candidate.id, isDeleted: false }
        });

        const savedJobsCount = await this._context.SavedJobPostRepo.count({
          where: { candidateId: candidate.id }
        });

        const followedCompaniesCount = await this._context.FollowedCompanyRepo.count({
          where: { candidateId: candidate.id }
        });

        const currentDate = new Date();
        const monthlyActivity: IMonthlyActivity[] = [];

        for (let i = 11; i >= 0; i--) {
          const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
          
          const monthStr = `T${monthDate.getMonth() + 1}-${monthDate.getFullYear()}`;

          const appliedInMonth = await this._context.JobPostActivityRepo.count({
            where: {
              candidateId: candidate.id,
              isDeleted: false,
              createdAt: Between(monthDate, nextMonthDate)
            }
          });

          const savedInMonth = await this._context.SavedJobPostRepo.count({
            where: {
              candidateId: candidate.id,
              createdAt: Between(monthDate, nextMonthDate)
            }
          });

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

        return statistics;

      } catch (error) {
        logger.error(error?.message);
        console.error(`Error in CandidateService - getUserActivityStatistics() at ${new Date().toISOString()} - ${error?.message}`);
        throw error;
      }
    }

    async getRecommendedJobs(limit: number = 10): Promise<IJobPostDto[]> {
      try {
        const request = RequestStorage.getStore()?.get(LocalStorage.REQUEST_STORE);
        const userId = request?.user?.id;

        if (!userId) {
          throw new HttpException(StatusCodes.UNAUTHORIZED, EAuthError.UnauthorizedAccess, "Bạn không có quyền truy cập");
        }

        const candidate = await this._context.CandidateRepo.findOne({
          where: { userId }
        });

        if (!candidate) {
          throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound, "Không tìm thấy hồ sơ ứng viên");
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
          return []
        }

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


        let params: any = { candidateId: candidate.id, status: EJobPostStatus.APPROVED, now: new Date() };

        if (selectedResume.careerId) {
          params.careerId = selectedResume.careerId;
        }

        if (selectedResume.provinceId) {
          params.provinceId = selectedResume.provinceId;
        }

        query.setParameters(params);

        const jobPosts = await query
          .take(limit * 5) 
          .getMany();

        const scoredJobs = jobPosts.map((job) => {
          let score = 0;

          if (selectedResume.careerId && job.careerId === selectedResume.careerId) {
            score += 40;
          }

          if (selectedResume.provinceId && job.provinceId === selectedResume.provinceId) {
            score += 30;
          }

          if (selectedResume.position && job.position === selectedResume.position) {
            score += 15;
          }

          if (selectedResume.experience && job.experience === selectedResume.experience) {
            score += 10;
          }

          if (selectedResume.jobType && job.jobType === selectedResume.jobType) {
            score += 5;
          }

          if (selectedResume.salaryMin && selectedResume.salaryMax) {
            if (job.salaryMax >= selectedResume.salaryMin && job.salaryMin <= selectedResume.salaryMax) {
              score += 5;
            }
          }

          if (selectedResume.typeOfWorkPlace && job.typeOfWorkPlace === selectedResume.typeOfWorkPlace) {
            score += 3;
          }

          // Match academic level (2 points)
          if (selectedResume.academicLevel && job.academicLevel === selectedResume.academicLevel) {
            score += 2;
          }

          return { job, score };
        });

        const topJobs = scoredJobs
          .sort((a, b) => {
            // Sort by score first
            if (b.score !== a.score) {
              return b.score - a.score;
            }
            return new Date(b.job.createdAt).getTime() - new Date(a.job.createdAt).getTime();
          })
          .slice(0, limit)
          .map(item => item.job);

        const recommendedJobs = topJobs.map((job) => 
          JobPostMapper.toJobPosDto(job, candidate.id)
        );

        return recommendedJobs;

      } catch (error) {
        logger.error(error?.message);
        console.error(`Error in CandidateService - getRecommendedJobs() at ${new Date().toISOString()} - ${error?.message}`);
        throw error;
      }
    }
    

    
}