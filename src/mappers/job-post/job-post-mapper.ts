import { JobPost } from "@/entities/job-post";
import { ICreateJobPostReq, IUpdateJobPostReq, ICompanyJobPostDto, IJobPostDto } from "@/interfaces/job-post/job-post-dto";
import { EJobPostStatus } from "@/common/enums/job/EJobPostStatus";
import { FileType } from "@/common/enums/file-type/file-types";
import { JobPostActivity } from "@/entities/job-post-activity";

export default class JobPostMapper {
  public static toCreateJobPostEntity(dto: ICreateJobPostReq, companyId: number): JobPost {
    const job = new JobPost();
    job.careerId = dto.careerId;
    job.companyId = companyId;
    job.provinceId = dto.provinceId;
    job.jobName = dto.jobName;
    job.deadline = dto.deadline;
    job.quantity = dto.quantity;
    job.jobDescription = dto.jobDescription;
    job.jobRequirement = dto.jobRequirement;
    job.benefitsEnjoyed = dto.benefitsEnjoyed;
    job.salaryMin = dto.salaryMin;
    job.salaryMax = dto.salaryMax;
    job.position = dto.position;
    job.typeOfWorkPlace = dto.typeOfWorkPlace;
    job.experience = dto.experience;
    job.academicLevel = dto.academicLevel;
    job.genderRequirement = dto.genderRequirement;
    job.jobType = dto.jobType;
    job.contactPersonName = dto.contactPersonName;
    job.contactPersonEmail = dto.contactPersonEmail;
    job.contactPersonPhone = dto.contactPersonPhone;
    job.status = EJobPostStatus.PENDING_APPROVAL;
    job.views = 0;
    return job;
  }

  public static toUpdateJobPostEntity(dto: IUpdateJobPostReq): JobPost {
    const job = new JobPost();
    job.careerId = dto.careerId;
    job.provinceId = dto.provinceId;
    job.jobName = dto.jobName;
    job.deadline = dto.deadline;
    job.quantity = dto.quantity;
    job.jobDescription = dto.jobDescription;
    job.jobRequirement = dto.jobRequirement;
    job.benefitsEnjoyed = dto.benefitsEnjoyed;
    job.salaryMin = dto.salaryMin;
    job.salaryMax = dto.salaryMax;
    job.position = dto.position;
    job.typeOfWorkPlace = dto.typeOfWorkPlace;
    job.experience = dto.experience;
    job.academicLevel = dto.academicLevel;
    job.genderRequirement = dto.genderRequirement;
    job.jobType = dto.jobType;
    job.contactPersonName = dto.contactPersonName;
    job.contactPersonEmail = dto.contactPersonEmail;
    job.contactPersonPhone = dto.contactPersonPhone;
    job.status = EJobPostStatus.PENDING_APPROVAL;
    return job;
  }

  public static toCompanyJobPostDto(entity: JobPost): ICompanyJobPostDto {
    return {
      id: entity.id,
      careerId: entity.careerId,
      companyId: entity.companyId,
      provinceId: entity.provinceId,
      jobName: entity.jobName,
      deadline: entity.deadline,
      quantity: entity.quantity,
      jobDescription: entity.jobDescription,
      jobRequirement: entity.jobRequirement,
      benefitsEnjoyed: entity.benefitsEnjoyed,
      salaryMin: entity.salaryMin,
      salaryMax: entity.salaryMax,
      position: entity.position,
      typeOfWorkPlace: entity.typeOfWorkPlace,
      experience: entity.experience,
      academicLevel: entity.academicLevel,
      genderRequirement: entity.genderRequirement,
      jobType: entity.jobType,
      isHot: entity.hotExpiredAt ? new Date() < new Date(entity.hotExpiredAt) : false,
      contactPersonName: entity.contactPersonName,
      contactPersonEmail: entity.contactPersonEmail,
      contactPersonPhone: entity.contactPersonPhone,
      views: entity.views,
      applications: (entity as any).applications ?? 0,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      status: entity.status,
      company: entity.company ? {
        id: entity.company.id,
        companyName: entity.company.companyName,
      } : undefined,
    };
  }

  public static toListCompanyJobPostDto(entities: JobPost[]): ICompanyJobPostDto[] {
    return entities.map((entity) => this.toCompanyJobPostDto(entity));
  }

  public static toJobPosDto(entity: JobPost, candidateId?: number): IJobPostDto {
    let logo: string | undefined
    let coverImage: string | undefined
    const images: string[] = []

    entity.company?.companyImages?.forEach(ci => {
      if (!ci.image) return
      switch (ci.image.fileType) {
        case FileType.LOGO:
          logo = ci.image.url
          break
        case FileType.COVER_IMAGE:
          coverImage = ci.image.url
          break
        case FileType.COMPANY_IMAGE:
          images.push(ci.image.url)
          break
      }
    })

    const isSaved = candidateId
      ? (entity.savedJobPosts?.length ?? 0) > 0
      : false;

    const oneDayMs = 24 * 60 * 60 * 1000;
    const isNew = entity.createdAt
      ? (Date.now() - entity.createdAt.getTime()) < oneDayMs
      : false;

    const isApplied = candidateId
      ? (entity.jobPostActivities?.length ?? 0) > 0
      : false;

    return {
      id: entity.id,
      isNew: isNew,
      isSaved: isSaved,
      isApplied: isApplied,
      provinceId: entity.provinceId,
      jobName: entity.jobName,
      deadline: entity.deadline,
      quantity: entity.quantity,
      jobDescription: entity.jobDescription,
      jobRequirement: entity.jobRequirement,
      benefitsEnjoyed: entity.benefitsEnjoyed,
      salaryMin: entity.salaryMin,
      salaryMax: entity.salaryMax,
      position: entity.position,
      typeOfWorkPlace: entity.typeOfWorkPlace,
      experience: entity.experience,
      academicLevel: entity.academicLevel,
      genderRequirement: entity.genderRequirement,
      jobType: entity.jobType,
      isHot: entity.hotExpiredAt ? new Date() < new Date(entity.hotExpiredAt) : false,
      contactPersonName: entity.contactPersonName,
      contactPersonEmail: entity.contactPersonEmail,
      contactPersonPhone: entity.contactPersonPhone,
      views: entity.views,
      applications: (entity as any).applications ?? 0,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      status: entity.status,
      company: {
        companyName: entity.company.companyName,
        logo: logo,
        coverImage: coverImage,
        images: images
      },
    };
  }

  public static toListJobPostDto(entities: JobPost[], candidateId?: number): IJobPostDto[] {
    return entities.map((entity) => this.toJobPosDto(entity, candidateId));
  }
}
