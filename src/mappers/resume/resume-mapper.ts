import { IOnlineResumeDto, IResumeDto } from "@/dtos/resume/resume-dto";
import { Resume } from "@/entities/resume";
import { CandidateMapper } from "../candidate/candidate-mapper";
import { EducationMapper } from "../education/education-mapper";
import { ExperienceMapper } from "../experience/experience-mapper";
import { LanguageMapper } from "../language/language-mapper";
import { SkillMapper } from "../skill/skill-mapper";
import { CertificateMapper } from "../certificate/certificate-mapper";
import MyjobFileMapper from "../myjob-file/myjob-file-mapper";

export class ResumeMapper {
    public static toResumeDto(entity: Resume, isSaved?: boolean): IResumeDto {
        return {
            id: entity.id,
            candidateId: entity.candidateId,
            careerId: entity.careerId,
            provinceId: entity.provinceId,
            myJobFileId: entity.myJobFileId,
            title: entity.title,
            description: entity.description,
            salaryMin: entity.salaryMin,
            salaryMax: entity.salaryMax,
            position: entity.position,
            typeOfWorkPlace: entity.typeOfWorkPlace,
            experience: entity.experience,
            academicLevel: entity.academicLevel,
            jobType: entity.jobType,
            type: entity.type,
            selected: entity.selected,
            isSaved: isSaved,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            myJobFile: MyjobFileMapper.toMyJobFileDto(entity.myJobFile),
            candidate: entity.candidate ? CandidateMapper.toCandidateDto(entity.candidate) : undefined,
        };
    }

    public static toListResumeDto(entities: Resume[]): IResumeDto[] {
        return entities.map(entity => this.toResumeDto(entity));
    }

    public static toOnlineResumeDto(entity: Resume): IOnlineResumeDto {
        return {
            resume: ResumeMapper.toResumeDto(entity),
            candidate: entity.candidate ? CandidateMapper.toCandidateDto(entity.candidate) : undefined,
            educations: entity.educations ? EducationMapper.toListEducationDto(entity.educations) : [],
            certificates: entity.certificates ? CertificateMapper.toListCertificateDto(entity.certificates) : [],
            experiences: entity.experiences ? ExperienceMapper.toListExperienceDto(entity.experiences) : [],
            languages: entity.languages ? LanguageMapper.toListLanguageDto(entity.languages) : [],
            skills: entity.skills ? SkillMapper.toListSkillDto(entity.skills) : [],
        };
    }
}
