import { Auth } from "@/common/middlewares"
import IJobPostActivityService from "@/interfaces/job-post-activity/job-post-activity-interface"
import { before, inject, POST, route } from "awilix-express"
import { Request, Response } from "express";

@route('/job-post-activity')
export class JobPostController {
    private readonly _jobPostActivityService: IJobPostActivityService
    constructor(JobPostActivityService: IJobPostActivityService) {
        this._jobPostActivityService = JobPostActivityService
    }
    @before(inject(Auth.required))
    @POST()
    @route("/apply-job")
    async applyJob(req: Request, res: Response) {
        const data = req.body
        const response = await this._jobPostActivityService.applyJob(data)
        return res.status(201).json(response)
    }

}