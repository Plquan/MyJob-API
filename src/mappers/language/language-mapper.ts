import { ILanguageDto } from "@/dtos/language/language-dto";
import { Language } from "@/entities/language";

export class LanguageMapper {
    public static toLanguageDto(entity: Language): ILanguageDto {
        return {
            id: entity.id,
            resumeId: entity.resumeId,
            language: entity.language,
            level: entity.level,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    public static toListLanguageDto(entities: Language[]): ILanguageDto[] {
        return entities.map(entity => this.toLanguageDto(entity));
    }
}
