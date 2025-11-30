import { ISkillDto } from "@/dtos/skill/skill-dto";
import { Skill } from "@/entities/skill";

export class SkillMapper {
    public static toSkillDto(entity: Skill): ISkillDto {
        return {
            id: entity.id,
            resumeId: entity.resumeId,
            name: entity.name,
            level: entity.level,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    public static toListSkillDto(entities: Skill[]): ISkillDto[] {
        return entities.map(entity => this.toSkillDto(entity));
    }
}
