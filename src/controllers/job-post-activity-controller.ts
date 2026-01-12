import { Auth } from "@/common/middlewares"
import IJobPostActivityService from "@/interfaces/job-post-activity/job-post-activity-interface"
import { before, DELETE, GET, inject, POST, PUT, route } from "awilix-express"
import { Request, Response } from "express";

@before(inject(Auth.required))
@route('/job-post-activity')
export class JobPostController {
    private readonly _jobPostActivityService: IJobPostActivityService
    constructor(JobPostActivityService: IJobPostActivityService) {
        this._jobPostActivityService = JobPostActivityService
    }

    @POST()
    @route("/apply-job")
    async applyJob(req: Request, res: Response) {
        const data = req.body
        const response = await this._jobPostActivityService.applyJob(data)
        return res.status(201).json(response)
    }

    @GET()
    async getJobPostActivities(req: Request, res: Response) {
        const { page, limit, search, status } = req.query;

        const response = await this._jobPostActivityService.getJobPostActivities({
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            search: search as string | undefined,
            status: status !== undefined
                ? Number(status)
                : undefined,
        })
        return res.status(200).json(response);
    }

    @GET()
    @route("/:jobPostActivityId")
    async getJobPostActivityId(req: Request, res: Response) {
        const jobPostActivityId = parseInt(req.params.jobPostActivityId)
        const response = await this._jobPostActivityService.getJobActivityById(jobPostActivityId)
        return res.status(200).json(response);
    }

    @PUT()
    async updateJobPostActivityStatus(req: Request, res: Response) {
        const data = req.body
        const response = await this._jobPostActivityService.updateJobPostActivityStatus(data)
        return res.status(200).json(response);
    }

    @DELETE()
    @route("/:jobPostActivityId")
    async deleteJobPostActivityId(req: Request, res: Response) {
        const jobPostActivityId = parseInt(req.params.jobPostActivityId)
        const response = await this._jobPostActivityService.deleteJobPostActivity(jobPostActivityId)
        return res.status(204).json(response);
    }

    @POST()
    @route("/send-email")
    async sendEmailToCandidate(req: Request, res: Response) {
        const { jobPostActivityId, ...emailData } = req.body;
        const response = await this._jobPostActivityService.sendEmailToCandidate(
            jobPostActivityId ? parseInt(jobPostActivityId) : null,
            emailData
        );
        return res.status(200).json(response);
    }
}