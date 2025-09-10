import { JobPost } from "@/entities/job-post";
import IJobPostService from "@/interfaces/jobPost/job-post-interface";
import DatabaseService from "../common/database-service";
import { CreateJobPostRequest } from "@/dtos/job/create-job-post-request";

export default class JobPostService implements IJobPostService {
    private readonly _context: DatabaseService

    constructor(DatabaseService: DatabaseService) {
        this._context = DatabaseService
    }
    async getAllJobPosts(): Promise<JobPost[]> {
        const jobPosts = await this._context.JobPostRepo.find()
        return jobPosts
    }
    async CreateJobPost(data: CreateJobPostRequest, userId: number): Promise<JobPost> {
        const company = await this._context.CompanyRepo.findOne({
            where: { userId },
        });
        if (!company) {
            // throw new HttpException(400, 'cc')
        }
        data.companyId = company.id
        const newJobPost = this._context.JobPostRepo.create(data)
        await this._context.JobPostRepo.save(newJobPost)
        return newJobPost
    }
    UpdateJobPost(): Promise<JobPost> {
        throw new Error("Method not implemented.");
    }

}