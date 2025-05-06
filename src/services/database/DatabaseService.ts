import { DataSource, Repository, QueryRunner } from "typeorm";
import logger from "@/helpers/logger";
import { ENV } from "@/constants/env";

import { User } from "@/entity/User";
import { SavedJob } from "@/entity/SavedJob";
import { Resume } from "@/entity/Resume";
import { Province } from "@/entity/Province";
import { Permission } from "@/entity/Permission";
import { MediaFile } from "@/entity/MediaFile";
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
import { JobActivity } from "@/entity/JobActivity";
import { JobPost } from "@/entity/JobPost";
import { Language } from "@/entity/Language";

import dataSource from "@/ormconfig";
import "reflect-metadata";

class DatabaseService {
  private _dataSource: DataSource;

  public UserRepo: Repository<User>;
  public SavedJobRepo: Repository<SavedJob>;
  public ResumeRepo: Repository<Resume>;
  public ProvinceRepo: Repository<Province>;
  public PermissionRepo: Repository<Permission>;
  public MediaFileRepo: Repository<MediaFile>;
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
  public JobActivityRepo: Repository<JobActivity>;
  public JobPostRepo: Repository<JobPost>;
  public LanguageRepo: Repository<Language>;

  constructor() {
    this._dataSource = dataSource;

    this.UserRepo = this._dataSource.getRepository(User);
    this.SavedJobRepo = this._dataSource.getRepository(SavedJob);
    this.ResumeRepo = this._dataSource.getRepository(Resume);
    this.ProvinceRepo = this._dataSource.getRepository(Province);
    this.PermissionRepo = this._dataSource.getRepository(Permission);
    this.MediaFileRepo = this._dataSource.getRepository(MediaFile);
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
    this.JobActivityRepo = this._dataSource.getRepository(JobActivity);
    this.JobPostRepo = this._dataSource.getRepository(JobPost);
    this.LanguageRepo = this._dataSource.getRepository(Language);

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
