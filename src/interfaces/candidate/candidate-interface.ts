import { User } from "@/entities/user"
import { EntityManager } from "typeorm"
import { ICandidateData, ICandidateDto } from "../../dtos/candidate/candidate-dto"
import { IJobPostDto } from "../job-post/job-post-dto"
import { IUserActivityStatistics } from "./candidate-statistics-interface"

export default interface ICandidateService {
  getProfile(): Promise<ICandidateDto>
  createProfile(data:User,manager: EntityManager):Promise<ICandidateDto>
  updateProfile(data: ICandidateData):Promise<ICandidateDto>
  allowSearch(status: boolean): Promise<boolean>
  getUserActivityStatistics(): Promise<IUserActivityStatistics>
  getRecommendedJobs(limit?: number): Promise<IJobPostDto[]>
}
