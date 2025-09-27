import { JobPost } from "@/entities/job-post";
import IJobPostService from "@/interfaces/jobPost/job-post-interface";
import DatabaseService from "../common/database-service";
import { ICreateJobPostReq } from "@/interfaces/jobPost/job-post-dto";
import { HttpException } from "@/errors/http-exception";
import { StatusCodes } from "http-status-codes";
import { ErrorMessages } from "@/common/constants/ErrorMessages";
import { getCurrentUser } from "@/common/helpers/get-current-user";
import JobPostMapper from "@/mappers/job-post/job-post-mapper";

export default class JobPostService implements IJobPostService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
    }
    validateJobPost(dto: ICreateJobPostReq) {
        if (
            !dto.careerId ||
            !dto.provinceId ||
            !dto.districtId ||
            !dto.jobName ||
            !dto.deadline ||
            dto.quantity == null ||
            !dto.jobDescription ||
            !dto.jobRequirement ||
            !dto.benefitsEnjoyed ||
            dto.salaryMin == null ||
            dto.salaryMax == null ||
            !dto.position ||
            !dto.typeOfWorkPlace ||
            !dto.experience ||
            !dto.academicLevel ||
            !dto.jobType ||
            !dto.contactPersonName ||
            !dto.contactPersonEmail ||
            !dto.contactPersonPhone
        ) {
            throw new HttpException(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_REQUEST_BODY)
        }
    }
    async getAllJobPosts(): Promise<JobPost[]> {
        const jobPosts = await this._context.JobPostRepo.find()
        return jobPosts
    }
    async CreateJobPost(data: ICreateJobPostReq): Promise<JobPost> {
        try {
            this.validateJobPost(data)
            const companyId = getCurrentUser().companyId
            const newJobPost = this._context.JobPostRepo.create(JobPostMapper.toCreateJobPostEntity(data, companyId))
            await this._context.JobPostRepo.save(newJobPost)
            return newJobPost
        } catch (error) {

        }
    }
    UpdateJobPost(): Promise<JobPost> {
        throw new Error("Method not implemented.");
    }

}