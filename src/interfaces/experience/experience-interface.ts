import { ICreateExperienceData, IUpdateExperienceData, IExperienceDto } from "../../dtos/experience/experience-dto";

export  default interface IExperienceService {
    getAllExperiences(): Promise<IExperienceDto[]>
    createExperience(data: ICreateExperienceData): Promise<IExperienceDto>
    updateExperience(data: IUpdateExperienceData): Promise<IExperienceDto>
    deleteExperience(experienceId: number): Promise<boolean>
}