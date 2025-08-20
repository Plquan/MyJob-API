import { validateDto } from "@/common/helpers/validate-dto";
import { CreateJobPostRequest } from "@/dtos/job/create-job-post-request";
import IJobPostService from "@/interfaces/jobPost/job-post-interface";
import { authenticate } from "@/common/middlewares/authenticate-middleware";
import { before, POST, route } from "awilix-express";
import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";

@before(authenticate())
@route('/job-post')
export class JobPostController {
    private readonly _jobPostService: IJobPostService
    constructor(JobPostService: IJobPostService) {
        this._jobPostService = JobPostService
    }

    @POST()
    async createJobPost(req: Request, res: Response,next: NextFunction) {
      try {
          const data = plainToInstance(CreateJobPostRequest, req.body)
        const userId = req.user?.id;
        await validateDto(data)
        const response = await this._jobPostService.CreateJobPost(data,userId);
        res.status(201).json(response)
      } catch (error) {
        next(error);
      }
    }


}