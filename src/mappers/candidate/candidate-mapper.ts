import { Candidate } from "@/entities/candidate";
import { ICandidateDto } from "@/dtos/candidate/candidate-dto";

export class CandidateMapper {
  public static toCandidateDto(entity: Candidate): ICandidateDto {
    return {
      id: entity.id,
      userId: entity.userId,
      provinceId: entity.provinceId,
      fullName: entity.fullName,
      phone: entity.phone,
      birthday: entity.birthday,
      gender: entity.gender,
      maritalStatus: entity.maritalStatus,
      address: entity.address,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
