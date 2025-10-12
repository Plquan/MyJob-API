import { JobPost } from "@/entities/job-post";
import { ICreateJobPostReq, IUpdateJobPostReq, JobPostDto } from "@/interfaces/jobPost/job-post-dto";
import { EJobPostStatus } from "@/common/enums/job/EJobPostStatus";

export default class JobPostMapper {
  public static toCreateJobPostEntity(dto: ICreateJobPostReq, companyId: number): JobPost {
    const job = new JobPost();
    job.careerId = dto.careerId;
    job.companyId = companyId;
    job.provinceId = dto.provinceId;
    job.districtId = dto.districtId;
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
    job.districtId = dto.districtId;
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
    job.jobType = dto.jobType;
    job.contactPersonName = dto.contactPersonName;
    job.contactPersonEmail = dto.contactPersonEmail;
    job.contactPersonPhone = dto.contactPersonPhone;
    job.status = EJobPostStatus.PENDING_APPROVAL;
    return job;
  }

  public static toJobPostDto(entity: JobPost): JobPostDto {
    return {
      id: entity.id,
      careerId: entity.careerId,
      companyId: entity.companyId,
      provinceId: entity.provinceId,
      districtId: entity.districtId,
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
      jobType: entity.jobType,
      isHot: entity.isHot,
      isUrgent: entity.isUrgent,
      contactPersonName: entity.contactPersonName,
      contactPersonEmail: entity.contactPersonEmail,
      contactPersonPhone: entity.contactPersonPhone,
      views: entity.views,
      applications: (entity as any).applications ?? 0,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      status: entity.status ?? EJobPostStatus.PENDING_APPROVAL,
    };
  }

  public static toJobPostListDto(entities: JobPost[]): JobPostDto[] {
    return entities.map((entity) => this.toJobPostDto(entity));
  }

}
