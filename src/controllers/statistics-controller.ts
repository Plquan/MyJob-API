import { Auth } from "@/common/middlewares";
import IStatisticsService from "@/interfaces/statistics/statistics-interface";
import { route, GET, before, inject } from "awilix-express";
import { Request, Response } from "express";

@route('/statistics')
export class StatisticsController {
  private readonly _statisticsService: IStatisticsService;

  constructor(StatisticsService: IStatisticsService) {
    this._statisticsService = StatisticsService;
  }

  @before(inject(Auth.required))
  @GET()
  @route('/stats')
  async getStats(req: Request, res: Response) {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    
    const response = await this._statisticsService.getStats(startDate, endDate);
    res.status(200).json(response);
  }

  @before(inject(Auth.required))
  @GET()
  @route('/user-chart')
  async getUserChart(req: Request, res: Response) {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    
    const response = await this._statisticsService.getUserChart(startDate, endDate);
    res.status(200).json(response);
  }

  @before(inject(Auth.required))
  @GET()
  @route('/job-post-chart')
  async getJobPostChart(req: Request, res: Response) {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    
    const response = await this._statisticsService.getJobPostChart(startDate, endDate);
    res.status(200).json(response);
  }

  @before(inject(Auth.required))
  @GET()
  @route('/top-careers')
  async getTopCareers(req: Request, res: Response) {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    
    const response = await this._statisticsService.getTopCareers(startDate, endDate);
    res.status(200).json(response);
  }

  @before(inject(Auth.required))
  @GET()
  @route('/application-chart')
  async getApplicationChart(req: Request, res: Response) {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    
    const response = await this._statisticsService.getApplicationChart(startDate, endDate);
    res.status(200).json(response);
  }

  @before(inject(Auth.required))
  @GET()
  @route('/revenue-package-chart')
  async getRevenuePackageChart(req: Request, res: Response) {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    
    const response = await this._statisticsService.getRevenuePackageChart(startDate, endDate);
    res.status(200).json(response);
  }

  @before(inject(Auth.required))
  @GET()
  @route('/dashboard')
  async getDashboardStats(req: Request, res: Response) {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    
    const response = await this._statisticsService.getDashboardStats(startDate, endDate);
    res.status(200).json(response);
  }
}

