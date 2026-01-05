import { ICreateSkillData, IUpdateSkillData, ISkillDto } from "../../dtos/skill/skill-dto";

export default interface ISkillService {
    getAllSkills():Promise<ISkillDto[]>
    createSkill(data: ICreateSkillData): Promise<ISkillDto>
    updateSkill(data: IUpdateSkillData): Promise<ISkillDto>
    deleteSkill(id: number): Promise<boolean>
}