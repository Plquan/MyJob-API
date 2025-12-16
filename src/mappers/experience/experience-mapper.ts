import { IExperienceDto } from "@/dtos/experience/experience-dto";
import { Experience } from "@/entities/experience";

export class ExperienceMapper {
  public static toExperienceDto(entity: Experience): IExperienceDto {
    return {
      id: entity.id,
      resumeId: entity.resumeId,
      jobName: entity.jobName,
      companyName: entity.companyName,
      startDate: entity.startDate,
      endDate: entity.endDate,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  public static toListExperienceDto(entities: Experience[]): IExperienceDto[] {
    return entities.map(entity => this.toExperienceDto(entity));
  }
}
