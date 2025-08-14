import { IResponseBase } from "../base/IResponseBase";
import { ICreateExperienceData, IUpdateExperienceData } from "../../dtos/experience/experience-dto";

export  default interface IExperienceService {
    getAllExperiences(): Promise<IResponseBase>
    createExperience(data: ICreateExperienceData): Promise<IResponseBase>
    updateExperience(data: IUpdateExperienceData): Promise<IResponseBase>
    deleteExperience(experienceId: number): Promise<IResponseBase>
}