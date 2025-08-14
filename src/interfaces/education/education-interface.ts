import { IResponseBase } from "../base/IResponseBase";
import { ICreateEducationData, IUpdateEducationData } from "../../dtos/education/education-dto";

export default interface IEducationService {
    getAllEducations(): Promise<IResponseBase>
    createEducation(data: ICreateEducationData): Promise<IResponseBase>
    updateEducation(data: IUpdateEducationData): Promise<IResponseBase>
    deleteEducation(educationId: number): Promise<IResponseBase>
}