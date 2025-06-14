import { DataSource, Repository, QueryRunner } from "typeorm";
import logger from "@/helpers/logger";
import { ENV } from "@/constants/env";

import { User } from "@/entity/User";
import { SavedJobPost } from "@/entity/SavedJobPost";
import { Resume } from "@/entity/Resume";
import { Province } from "@/entity/Province";
import { Permission } from "@/entity/Permission";
import { MyJobFile } from "@/entity/MyJobFile";
import { AdvancedSkill } from "@/entity/AdvancedSkill";
import { Candidate } from "@/entity/Candidate";
import { Career } from "@/entity/Career";
import { Certificate } from "@/entity/Certificate";
import { Company } from "@/entity/Company";
import { CompanyFollowed } from "@/entity/CompanyFollowed";
import { Education } from "@/entity/Education";
import { Experience } from "@/entity/Experience";
import { Function as JobFunction } from "@/entity/Function";
import { GroupRole } from "@/entity/GroupRole";
import { JobPostActivity } from "@/entity/JobPostActivity";
import { JobPost } from "@/entity/JobPost";
import { Language } from "@/entity/Language";

import dataSource from "@/ormconfig";
import "reflect-metadata";
import { RefreshToken } from "@/entity/RefreshToken";
import { Role } from "@/entity/Role";
import { District } from "@/entity/District";

class DatabaseService {
  private _dataSource: DataSource;

  public UserRepo: Repository<User>;
  public SavedJobPostRepo: Repository<SavedJobPost>;
  public ResumeRepo: Repository<Resume>;
  public ProvinceRepo: Repository<Province>;
  public PermissionRepo: Repository<Permission>;
  public MyJobFileRepo: Repository<MyJobFile>;
  public AdvancedSkillRepo: Repository<AdvancedSkill>;
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

  constructor() {
    this._dataSource = dataSource;

    this.UserRepo = this._dataSource.getRepository(User);
    this.SavedJobPostRepo = this._dataSource.getRepository(SavedJobPost);
    this.ResumeRepo = this._dataSource.getRepository(Resume);
    this.ProvinceRepo = this._dataSource.getRepository(Province);
    this.PermissionRepo = this._dataSource.getRepository(Permission);
    this.MyJobFileRepo = this._dataSource.getRepository(MyJobFile);
    this.AdvancedSkillRepo = this._dataSource.getRepository(AdvancedSkill);
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
