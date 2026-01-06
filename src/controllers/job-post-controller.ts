import { Auth } from "@/common/middlewares";
import { IGetCompanyJobPostsReqParams, IGetJobPostsReqParams } from "@/interfaces/job-post/job-post-dto";
import IJobPostService from "@/interfaces/job-post/job-post-interface";
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

    const params: IGetCompanyJobPostsReqParams = {
      page: +page,
      limit: +limit,
      search: search ? search.toString() : '',
      jobPostStatus: jobPostStatus ? +jobPostStatus : undefined,
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

  @before(inject(Auth.optional))
  @GET()
  async getJobPosts(req: Request, res: Response) {
    const { page = 1, limit = 10, jobName } = req.query;
    const params: IGetJobPostsReqParams = {
      page: +page,
      limit: +limit,
      jobName: jobName?.toString(),
    };
    const response = await this._jobPostService.getJobPosts(params);
    res.status(200).json(response)
  }


  @before(inject(Auth.required))
  @route("/toggle-save-job-post/:jobPostId")
  @POST()
  async toggleSaveJobPost(req: Request, res: Response) {
    const jobPostId = parseInt(req.params.jobPostId)
    const response = await this._jobPostService.toggleSaveJobPost(jobPostId);
    res.status(200).json(response)
  }
  
  @before(inject(Auth.required))
  @GET()
  @route("/saved-job-posts")
  async getSavedJobPosts(req: Request, res: Response) {
    const response = await this._jobPostService.getSavedJobPosts();
    res.status(200).json(response)
  }

  @before(inject(Auth.optional))
  @route("/:jobPostId")
  @GET()
  async getJobPostById(req: Request, res: Response) {
    const jobPostId = parseInt(req.params.jobPostId)
    const response = await this._jobPostService.getJobPostById(jobPostId);
    res.status(200).json(response)
  }

}