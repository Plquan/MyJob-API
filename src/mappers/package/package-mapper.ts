import { Package } from "@/entities/package";
import { PackageUsage } from "@/entities/package-usage";
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
  
  public static toCreatePackageUsage(entity: Package, companyId: number): PackageUsage {
    const usage = new PackageUsage();
    usage.packageId = entity.id;
    usage.companyId = companyId;
    usage.candidateSearchUsed = entity.candidateSearchLimit;
    usage.cvSearchUsed = entity.cvSearchLimit;
    usage.jobPostUsed = entity.jobPostLimit;
    return usage;
  }

}
