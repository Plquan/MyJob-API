import { IResponseBase } from "../base/IResponseBase";
import { ICreateSkillData, IUpdateSkillData } from "./SkillDto";

export default interface ISkillService {
    getAllSkills():Promise<IResponseBase>
    createSkill(data: ICreateSkillData): Promise<IResponseBase>
    updateSkill(data: IUpdateSkillData): Promise<IResponseBase>
    deleteSkill(id: number): Promise<IResponseBase>
}