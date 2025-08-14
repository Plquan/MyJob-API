import { DataSource, Repository, QueryRunner} from "typeorm";
import logger from "@/common/helpers/logger";
import { ENV } from "@/common/constants/env";

import { User } from "@/entities/user";
import { SavedJobPost } from "@/entities/save-job-post";
import { Resume } from "@/entities/resume";
import { Province } from "@/entities/province";
import { Permission } from "@/entities/permission";
import { MyJobFile } from "@/entities/my-job-file";
import { Candidate } from "@/entities/candidate";
import { Career } from "@/entities/career";
import { Certificate } from "@/entities/certificate";
import { Company } from "@/entities/company";
import { CompanyFollowed } from "@/entities/company-followed";
import { Education } from "@/entities/education";
import { Experience } from "@/entities/experience";
import { Function as JobFunction } from "@/entities/function";
import { GroupRole } from "@/entities/group-role";
import { JobPostActivity } from "@/entities/job-post-activity";
import { JobPost } from "@/entities/job-post";
import { Language } from "@/entities/language";

import dataSource from "@/orm-config";
import { RefreshToken } from "@/entities/refresh-token";
import { Role } from "@/entities/role";
import { District } from "@/entities/district";
import { Skill } from "@/entities/skill";
import { Package } from "@/entities/package";
import { PackageFeature } from "@/entities/package-feature";
import { PackagePurchased } from "@/entities/package-purchased";
import { PackageUsage } from "@/entities/package-usage";

class DatabaseService {
  private _dataSource: DataSource;

  public UserRepo: Repository<User>;
  public SavedJobPostRepo: Repository<SavedJobPost>;
  public ResumeRepo: Repository<Resume>;
  public ProvinceRepo: Repository<Province>;
  public PermissionRepo: Repository<Permission>;
  public MyJobFileRepo: Repository<MyJobFile>;
  public SkillRepo: Repository<Skill>;
  public CandidateRepo: Repository<Candidate>;
  public CareerRepo: Repository<Career>;
  public CertificateRepo: Repository<Certificate>;
  public CompanyRepo: Repository<Company>;
  public CompanyFollowedRepo: Repository<CompanyFollowed>;
  public EducationRepo: Repository<Education>;
  public ExperienceRepo: Repository<Experience>;
  public FunctionRepo: Repository<JobFunction>;
  public GroupRoleRepo: Repository<GroupRole>;
  public JobPostActivityRepo: Repository<JobPostActivity>;
  public JobPostRepo: Repository<JobPost>;
  public LanguageRepo: Repository<Language>;
  public RefreshTokenRepo: Repository<RefreshToken>
  public RoleRepo: Repository<Role>;
  public DistrictRepo: Repository<District>
  public PackageRepo: Repository<Package>
  public PackageFeatureRepo: Repository<PackageFeature>
  public PackagePurchasedRepo: Repository<PackagePurchased>
  public PackageUsageRepo: Repository<PackageUsage>
  connection: any;

  constructor() {
    this._dataSource = dataSource;

    this.UserRepo = this._dataSource.getRepository(User);
    this.SavedJobPostRepo = this._dataSource.getRepository(SavedJobPost);
    this.ResumeRepo = this._dataSource.getRepository(Resume);
    this.ProvinceRepo = this._dataSource.getRepository(Province);
    this.PermissionRepo = this._dataSource.getRepository(Permission);
    this.MyJobFileRepo = this._dataSource.getRepository(MyJobFile);
    this.SkillRepo = this._dataSource.getRepository(Skill);
    this.CandidateRepo = this._dataSource.getRepository(Candidate);
    this.CareerRepo = this._dataSource.getRepository(Career);
    this.CertificateRepo = this._dataSource.getRepository(Certificate);
    this.CompanyRepo = this._dataSource.getRepository(Company);
    this.CompanyFollowedRepo = this._dataSource.getRepository(CompanyFollowed);
    this.EducationRepo = this._dataSource.getRepository(Education);
    this.ExperienceRepo = this._dataSource.getRepository(Experience);
    this.FunctionRepo = this._dataSource.getRepository(JobFunction);
    this.GroupRoleRepo = this._dataSource.getRepository(GroupRole);
    this.JobPostActivityRepo = this._dataSource.getRepository(JobPostActivity);
    this.JobPostRepo = this._dataSource.getRepository(JobPost);
    this.LanguageRepo = this._dataSource.getRepository(Language);
    this.RefreshTokenRepo = this._dataSource.getRepository(RefreshToken);
    this.RoleRepo = this._dataSource.getRepository(Role);
    this.DistrictRepo = this._dataSource.getRepository(District);
    this.PackageRepo = this._dataSource.getRepository(Package);
    this.PackageFeatureRepo = this._dataSource.getRepository(PackageFeature);
    this.PackagePurchasedRepo = this._dataSource.getRepository(PackagePurchased);
    this.PackageUsageRepo = this._dataSource.getRepository(PackageUsage);

    this._dataSource
      .initialize()
      .then(() => {
        console.log(`Database connection established at: ${new Date().toISOString()}`);
        logger.info(`Database connected to: ${ENV.DB_HOST}:${ENV.DB_PORT} at ${new Date().toISOString()}`);
      })
      .catch((error) => {
        console.error("Database connection failed:", error);
        logger.error(`DB connection failed at ${new Date().toISOString()}: ${error}`);
      });
  }

  public createQueryRunner(): QueryRunner {
    return this._dataSource.createQueryRunner();
  }

  public getDataSource(): DataSource {
    return this._dataSource;
  }
}

export default DatabaseService;
