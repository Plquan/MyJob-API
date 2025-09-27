import { JobPost } from "@/entities/job-post";
import { ICreateJobPostReq } from "@/interfaces/jobPost/job-post-dto";
import { EJobPostStatus } from "@/common/enums/job/EJobPostStatus";

export default class JobPostMapper {
  public static toCreateJobPostEntity(dto: ICreateJobPostReq,companyId: number): JobPost {
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
    job.isHot = dto.isHot;
    job.isUrgent = dto.isUrgent;
    job.isActive = dto.isActive;
    job.contactPersonName = dto.contactPersonName;
    job.contactPersonEmail = dto.contactPersonEmail;
    job.contactPersonPhone = dto.contactPersonPhone;
    job.status = EJobPostStatus.PENDING_APPROVAL;
    job.views = 0;
    return job;
  }
}
