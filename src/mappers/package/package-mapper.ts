import { Package } from "@/entities/package";
import { ICreatePackageRequest, IPackageDto } from "@/interfaces/package/package-dto";

export default class PackageMapper {
  public static toPackageDto(entity: Package): IPackageDto {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price,
      durationInDays: entity.durationInDays,
      jobHotDurationInDays: entity.jobHotDurationInDays,
      highlightCompanyDurationInDays: entity.highlightCompanyDurationInDays,
      candidateSearchLimit: entity.candidateSearchLimit,
      cvSearchLimit: entity.cvSearchLimit,
      jobPostLimit: entity.jobPostLimit,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  public static toPackageDtoList(entities: Package[]): IPackageDto[] {
    return entities.map((pkg) => this.toPackageDto(pkg));
  }
}
