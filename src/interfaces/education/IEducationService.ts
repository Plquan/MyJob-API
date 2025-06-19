import { IResponseBase } from "../base/IResponseBase";
import { ICreateEducationData, IUpdateEducationData } from "./EducationDto";

export default interface IEducationService {
    getAllEducations(): Promise<IResponseBase>
    createEducation(data: ICreateEducationData): Promise<IResponseBase>
    updateEducation(data: IUpdateEducationData): Promise<IResponseBase>
    deleteEducation(educationId: number): Promise<IResponseBase>
}