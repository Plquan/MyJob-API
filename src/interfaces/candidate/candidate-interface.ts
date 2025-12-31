import { User } from "@/entities/user"
import { IResponseBase } from "../base/IResponseBase"
import { EntityManager } from "typeorm"
import { ICandidateData } from "../../dtos/candidate/candidate-dto"
 export default interface ICandidateService {
  getProfile(): Promise<IResponseBase>
  createProfile(data:User,manager: EntityManager):Promise<IResponseBase>
  updateProfile(data: ICandidateData):Promise<IResponseBase>
  allowSearch(status: boolean): Promise<IResponseBase>
  getUserActivityStatistics(): Promise<IResponseBase>
  getRecommendedJobs(limit?: number): Promise<IResponseBase>
}
