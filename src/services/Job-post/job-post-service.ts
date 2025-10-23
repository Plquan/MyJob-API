import { JobPost } from "@/entities/job-post";
import IJobPostService from "@/interfaces/jobPost/job-post-interface";
import DatabaseService from "../common/database-service";
import { ICreateJobPostReq, IGetJobPostsReqParams, IUpdateJobPostReq } from "@/interfaces/jobPost/job-post-dto";
import { HttpException } from "@/errors/http-exception";
import { StatusCodes } from "http-status-codes";
import { getCurrentUser } from "@/common/helpers/get-current-user";
import JobPostMapper from "@/mappers/job-post/job-post-mapper";
import { EGlobalError } from "@/common/enums/error/EGlobalError";
import { Brackets } from "typeorm";
import { IPaginationResponse } from "@/interfaces/base/IPaginationBase";
import { ErrorMessages } from "@/common/constants/ErrorMessages";

export default class JobPostService implements IJobPostService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
    }
    getJobPosts(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    deleteJobPost(jobPostId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    validateJobPost(dto: ICreateJobPostReq) {
        if (
            !dto.careerId ||
            !dto.provinceId ||
            !dto.districtId ||
            !dto.jobName ||
            !dto.deadline ||
            !dto.quantity ||
            !dto.jobDescription ||
            !dto.jobRequirement ||
            !dto.benefitsEnjoyed ||
            !dto.salaryMin ||
            !dto.salaryMax ||
            !dto.position ||
            !dto.typeOfWorkPlace ||
            !dto.experience ||
            !dto.academicLevel ||
            !dto.genderRequirement ||
            !dto.jobType ||
            !dto.contactPersonName ||
            !dto.contactPersonEmail ||
            !dto.contactPersonPhone
        ) {
            throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput.toString())
        }
    }
    async getCompanyJobPosts(params: IGetJobPostsReqParams): Promise<IPaginationResponse> {
        try {
            const { page, limit, search, jobPostStatus } = params;
            const companyId = getCurrentUser().companyId;
            if (!companyId) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
            }

            const query = this._context.JobPostRepo.createQueryBuilder("job")
                .leftJoin("job.jobPostActivities", "activity")
                .loadRelationCountAndMap("job.activityCount", "job.jobPostActivities")
                .where("job.companyId = :companyId", { companyId });

            if (jobPostStatus) {
                query.andWhere("job.status = :status", { status: jobPostStatus });
            }

            if (search && search.trim() !== "") {
                query.andWhere(
                    new Brackets((qb) => {
                        qb.where("job.jobName ILIKE :search", { search: `%${search}%` })

                    })
                );
            }

            const totalItems = await query.getCount();
            const jobPosts = await query
                .orderBy("job.createdAt", "DESC")
                .skip((page - 1) * limit)
                .take(limit)
                .getMany();

            return {
                items: JobPostMapper.toJobPostListDto(jobPosts),
                page: page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            };
        } catch (error) {
            console.log(
                `Error in JobPostService - method getCompanyJobPosts at ${new Date().getTime()} with message ${error?.message}`)
            throw error
        }
    }
    async createJobPost(data: ICreateJobPostReq): Promise<JobPost> {
        try {
            this.validateJobPost(data)
            const companyId = getCurrentUser().companyId
            if (!companyId) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
            }
            const newJobPost = this._context.JobPostRepo.create(JobPostMapper.toCreateJobPostEntity(data, companyId))
            await this._context.JobPostRepo.save(newJobPost)
            return newJobPost
        } catch (error) {
            console.log(
                `Error in JobPostService - method CreateJobPost at ${new Date().getTime()} with message ${error?.message}`)
            throw error
        }
    }
    async updateJobPost(data: IUpdateJobPostReq): Promise<JobPost> {
        try {
            const currentJobPost = await this._context.JobPostRepo.findOne({
                where: { id: data.id }
            })
            if (!currentJobPost) {
                throw new HttpException(StatusCodes.NOT_FOUND, EGlobalError.ResourceNotFound.toString());
            }
            const updateJobPostDto = JobPostMapper.toUpdateJobPostEntity(data)
            const updatedJobPost = this._context.JobPostRepo.merge(currentJobPost, updateJobPostDto)
            await this._context.JobPostRepo.save(updatedJobPost)
            return updatedJobPost
        } catch (error) {
            console.log(
                `Error in JobPostService - method UpdateJobPost at ${new Date().getTime()} with message ${error?.message}`)
            throw error
        }
    }

}