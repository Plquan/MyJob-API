import { IResponseBase } from "../base/IResponseBase";
import { ICreateSkillData, IUpdateSkillData } from "../../dtos/skill/skill-dto";

export default interface ISkillService {
    getAllSkills():Promise<IResponseBase>
    createSkill(data: ICreateSkillData): Promise<IResponseBase>
    updateSkill(data: IUpdateSkillData): Promise<IResponseBase>
    deleteSkill(id: number): Promise<IResponseBase>
}