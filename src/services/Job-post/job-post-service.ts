import { JobPost } from "@/entities/job-post";
import IJobPostService from "@/interfaces/job-post/job-post-interface";
import DatabaseService from "../common/database-service";
import { ICompanyJobPostDto, ICreateJobPostReq, IGetCompanyJobPostsReqParams, IGetJobPostsReqParams, IJobPostDto, IUpdateJobPostReq } from "@/interfaces/job-post/job-post-dto";
import { HttpException } from "@/errors/http-exception";
import { getCurrentUser } from "@/common/helpers/get-current-user";
import JobPostMapper from "@/mappers/job-post/job-post-mapper";
import { EGlobalError } from "@/common/enums/error/EGlobalError";
import { Brackets } from "typeorm";
import { IPaginationResponse } from "@/interfaces/base/IPaginationBase";
import { StatusCodes } from "@/common/enums/status-code/status-code.enum";
import { FileType } from "@/common/enums/file-type/file-types";

export default class JobPostService implements IJobPostService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
    }

    async getJobPostById(jobPostId: number): Promise<IJobPostDto> {
        const candidateId = getCurrentUser()?.candidateId
        try {
            const jobPost = await this._context.JobPostRepo.createQueryBuilder("job")
                .leftJoinAndSelect("job.company", "company")
                .leftJoinAndSelect("company.companyImages", "companyImage")
                .leftJoinAndSelect("companyImage.image", "image", "image.fileType = :fileType", { fileType: FileType.LOGO })
                .leftJoinAndSelect("job.savedJobPosts", "savedJobPost", "savedJobPost.candidateId = :candidateId", {
                    candidateId: candidateId ?? null
                })
                .leftJoinAndSelect(
                    "job.jobPostActivities",
                    "jobPostActivity",
                    "jobPostActivity.candidateId = :candidateId",
                    { candidateId: candidateId ?? null }
                )
                .where("job.id = :jobPostId", { jobPostId })
                .getOne()
            return JobPostMapper.toJobPosDto(jobPost, candidateId);
        } catch (error) {
            throw error
        }
    }
    async toggleSaveJobPost(jobPostId: number): Promise<boolean> {
        try {
            const candidateId = getCurrentUser()?.candidateId
            if (!candidateId) {
                throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.UnauthorizedAccess, "Unauthorize")
            }
            const savedJobPost = await this._context.SavedJobPostRepo.findOne({
                where: { jobPostId, candidateId }
            })
            if (!savedJobPost) {
                const newSavedJobPost = this._context.SavedJobPostRepo.create({
                    candidateId,
                    jobPostId
                })
                await this._context.SavedJobPostRepo.save(newSavedJobPost)
                return true
            }
            else {
                await this._context.SavedJobPostRepo.delete(savedJobPost.id)
                return false
            }
        } catch (error) {
            throw error
        }
    }
    async getJobPosts(params: IGetJobPostsReqParams): Promise<any> {
        try {
            const { page, limit, jobName } = params;
            const candidateId = getCurrentUser()?.candidateId;

            const query = this._context.JobPostRepo.createQueryBuilder("job")
                .select([
                    "job.id",
                    "job.jobName",
                    "job.salaryMin",
                    "job.salaryMax",
                    "job.provinceId",
                    "job.createdAt",
                    "job.isHot",
                    "job.deadline"
                ])
                .leftJoinAndSelect("job.company", "company")
                .leftJoinAndSelect("company.companyImages", "companyImage")
                .leftJoinAndSelect("companyImage.image", "image", "image.fileType = :fileType", { fileType: FileType.LOGO })
                .leftJoinAndSelect("job.savedJobPosts", "savedJobPost", "savedJobPost.candidateId = :candidateId", {
                    candidateId: candidateId ?? null
                })
            // .where("job.status = :status", { status:  EJobPostStatus.APPROVED });

            if (jobName && jobName.trim() !== "") {
                query.andWhere(
                    new Brackets((qb) => {
                        qb.where("job.jobName ILIKE :search", { search: `%${jobName}%` })
                            .orWhere("company.companyName ILIKE :search", { search: `%${jobName}%` });
                    })
                );
            }

            const totalItems = await query.getCount();
            const jobPosts = await query
                .orderBy("job.createdAt", "DESC")
                .skip((page - 1) * limit)
                .take(limit)
                .getMany();

            // return {
            //     items: JobPostMapper.toListJobPostDto(jobPosts),
            //     page: page,
            //     limit,
            //     totalItems,
            //     totalPages: Math.ceil(totalItems / limit),
            // } as IPaginationResponse

            return JobPostMapper.toListJobPostDto(jobPosts, candidateId)

        } catch (error) {
            throw error
        }
    }
    deleteJobPost(jobPostId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    validateJobPost(dto: ICreateJobPostReq) {
        if (
            !dto.careerId ||
            !dto.provinceId ||
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
            throw new HttpException(StatusCodes.BAD_REQUEST, EGlobalError.InvalidInput, "Invalid input")
        }
    }
    async getCompanyJobPosts(params: IGetCompanyJobPostsReqParams): Promise<IPaginationResponse<ICompanyJobPostDto>> {
        try {
            const { page, limit, search, jobPostStatus } = params;
            const companyId = getCurrentUser().companyId;
            if (!companyId) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "Company Id not found");
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
                items: JobPostMapper.toListCompanyJobPostDto(jobPosts),
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            };
        } catch (error) {
            throw error
        }
    }
    async createJobPost(data: ICreateJobPostReq): Promise<JobPost> {
        try {
            this.validateJobPost(data)
            const companyId = getCurrentUser().companyId
            if (!companyId) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "Company Id not found");
            }
            const newJobPost = this._context.JobPostRepo.create(JobPostMapper.toCreateJobPostEntity(data, companyId))
            await this._context.JobPostRepo.save(newJobPost)
            return newJobPost
        } catch (error) {
            throw error
        }
    }
    async updateJobPost(data: IUpdateJobPostReq): Promise<JobPost> {
        try {
            const currentJobPost = await this._context.JobPostRepo.findOne({
                where: { id: data.id }
            })
            if (!currentJobPost) {
                throw new HttpException(StatusCodes.UNAUTHORIZED, EGlobalError.UnauthorizedAccess, "Job post not found");
            }
            const updateJobPostDto = JobPostMapper.toUpdateJobPostEntity(data)
            const updatedJobPost = this._context.JobPostRepo.merge(currentJobPost, updateJobPostDto)
            await this._context.JobPostRepo.save(updatedJobPost)
            return updatedJobPost
        } catch (error) {
            throw error
        }
    }

}