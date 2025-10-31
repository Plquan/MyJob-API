import { Auth } from "@/common/middlewares";
import { IGetJobPostsReqParams } from "@/interfaces/jobPost/job-post-dto";
import IJobPostService from "@/interfaces/jobPost/job-post-interface";
import { before, GET, inject, POST, PUT, route } from "awilix-express";
import { Request, Response } from "express";

@route('/job-post')
export class JobPostController {
  private readonly _jobPostService: IJobPostService
  constructor(JobPostService: IJobPostService) {
    this._jobPostService = JobPostService
  }
  @before(inject(Auth.required))
  @POST()
  async createJobPost(req: Request, res: Response) {
    const data = req.body
    const response = await this._jobPostService.createJobPost(data);
    res.status(201).json(response)
  }

  @before(inject(Auth.required))
  @GET()
  @route("/get-company-job-posts")
  async getCompanyJobPosts(req: Request, res: Response) {
    const { page = 1, limit = 10, search, jobPostStatus } = req.query;

    const params: IGetJobPostsReqParams = {
      page: +page,
      limit: +limit,
      search: search.toString(),
      jobPostStatus: +jobPostStatus,
    };
    const response = await this._jobPostService.getCompanyJobPosts(params);
    res.status(200).json(response)
  }
  @before(inject(Auth.required))
  @PUT()
  async updateJobPost(req: Request, res: Response) {
    const data = req.body
    const response = await this._jobPostService.updateJobPost(data);
    res.status(200).json(response)
  }

}