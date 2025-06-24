import { User } from "@/entity/User"
import { IResponseBase } from "../base/IResponseBase"
import { EntityManager } from "typeorm"
import { ICandidateData, IResumeData } from "./CandidateDto"
 export default interface ICandidateService {
   getProfile(): Promise<IResponseBase>
   createProfile(data:User,manager: EntityManager):Promise<IResponseBase>
   updateProfile(data: ICandidateData):Promise<IResponseBase>
}
