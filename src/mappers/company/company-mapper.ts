
import { Company } from '@/entities/company';
import { ICompanyDetail, ICompanyDto, ICompanyWithImagesDto, ICreateFollowedCompany } from '@/interfaces/company/company-dto';
import MyjobFileMapper from '../myjob-file/myjob-file-mapper';
import JobPostMapper from '../job-post/job-post-mapper';
import { FollowedCompany } from '@/entities/followed-company';

export class CompanyMapper {
    public static toCompanyDto(entity: Company): ICompanyDto {
        return {
            id: entity.id,
            provinceId: entity.provinceId,
            districtId: entity.districtId,
            userId: entity.userId,
            companyName: entity.companyName,
            companyEmail: entity.companyEmail,
            companyPhone: entity.companyPhone,
            websiteUrl: entity.websiteUrl,
            youtubeUrl: entity.youtubeUrl,
            linkedInUrl: entity.linkedInUrl,
            facebookUrl: entity.facebookUrl,
            taxCode: entity.taxCode,
            since: entity.since,
            fieldOperation: entity.fieldOperation,
            description: entity.description,
            employeeSize: entity.employeeSize,
            address: entity.address,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    public static toCompanyWithImagesDto(entity: Company): ICompanyWithImagesDto {
        return {
            company: this.toCompanyDto(entity),
            images: entity.companyImages?.map(ci =>
                MyjobFileMapper.toMyJobFileDto(ci.image)
            ) ?? [],
        };
    }
    public static toCompanyWithJobsDto(entity: Company): ICompanyDetail {
        return {
            company: this.toCompanyDto(entity),
            images: entity.companyImages?.map(ci =>
                MyjobFileMapper.toMyJobFileDto(ci.image)
            ) ?? [],
            jobPosts: JobPostMapper.toJobPostListDto(entity.jobPosts)
        };
    }

    public static toCompanyDtos(entities: Company[]): ICompanyDto[] {
        return entities.map(e => this.toCompanyDto(e));
    }

    public static toFollowedCompanyFromCreate(candidateId: number, companyId: number): ICreateFollowedCompany {
        const followedCompany = new FollowedCompany()
        followedCompany.candidateId = candidateId
        followedCompany.companyId = companyId
        return followedCompany;
    }
}
