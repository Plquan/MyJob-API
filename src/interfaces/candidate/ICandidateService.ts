import { User } from "@/entity/User";
import { IResponseBase } from "../base/IResponseBase";
import { EntityManager } from "typeorm";
 export default interface ICandidateService {
    getCandidateOnlineResume(): Promise<IResponseBase>
    createCandidateProfile(data:User,manager: EntityManager):Promise<IResponseBase>
 }
