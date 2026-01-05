import { ICreateEducationData, IUpdateEducationData, IEducationDto } from "../../dtos/education/education-dto";

export default interface IEducationService {
    getAllEducations(): Promise<IEducationDto[]>
    createEducation(data: ICreateEducationData): Promise<IEducationDto>
    updateEducation(data: IUpdateEducationData): Promise<IEducationDto>
    deleteEducation(educationId: number): Promise<boolean>
}