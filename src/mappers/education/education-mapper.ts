import { IEducationDto } from "@/dtos/education/education-dto";
import { Education } from "@/entities/education";

export class EducationMapper {
  public static toEducationDto(entity: Education): IEducationDto {
    return {
      id: entity.id,
      resumeId: entity.resumeId,
      degreeName: entity.degreeName,
      major: entity.major,
      trainingPlace: entity.trainingPlace,
      startDate: entity.startDate,
      completedDate: entity.completedDate,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  public static toListEducationDto(entities: Education[]): IEducationDto[] {
    return entities.map(entity => this.toEducationDto(entity));
  }
}
