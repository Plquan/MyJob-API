
import { Company } from '@/entities/company';
import { ICompanyDto } from '@/interfaces/company/company-dto';
import MyjobFileMapper from '../myjob-file/myjob-file-mapper';

export class CompanyMapper {
    public static toCompanyDto(entity: Company): ICompanyDto {
        return {
            id: entity.id,
            provinceId: entity.provinceId,
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
            images: entity.companyImages?.map(ci =>
                MyjobFileMapper.toMyJobFileDto(ci.image)
            ) ?? [],
        };
    }

    public static toDtos(entities: Company[]): ICompanyDto[] {
        return entities.map(e => this.toCompanyDto(e));
    }
}
