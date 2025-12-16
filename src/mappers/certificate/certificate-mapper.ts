import { Certificate } from "@/entities/certificate";
import { ICertificateDto } from "@/dtos/certificate/certificate-dto";

export class CertificateMapper {
  public static toCertificateDto(entity: Certificate): ICertificateDto {
    return {
      id: entity.id,
      resumeId: entity.resumeId,
      name: entity.name,
      trainingPlace: entity.trainingPlace,
      startDate: entity.startDate,
      expirationDate: entity.expirationDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public static toListCertificateDto(entities: Certificate[]): ICertificateDto[] {
    return entities.map(entity => this.toCertificateDto(entity));
  }
}
