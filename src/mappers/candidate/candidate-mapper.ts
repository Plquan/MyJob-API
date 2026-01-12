import { Candidate } from "@/entities/candidate";
import { ICandidateDto } from "@/dtos/candidate/candidate-dto";
import MyjobFileMapper from "../myjob-file/myjob-file-mapper";
import UserMapper from "../user/user-mapper";

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
      avatar: MyjobFileMapper.toMyJobFileDto(entity.avatar),
      user: entity.user ? UserMapper.toUserDto(entity.user) : undefined
    }
  }
}
