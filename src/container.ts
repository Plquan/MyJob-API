import { asClass, createContainer, InjectionMode } from "awilix"
import JwtService from "./services/auth/jwt-service"
import AuthService from "./services/auth/auth-service"
import RoleService from "./services/role/role-service"
import CompanyService from "./services/company/company-service"
import DatabaseService from "./services/common/database-service"
import ProvinceService from "./services/province/province-service"
import UserService from "./services/user/user-service"
import AccountService from "./services/account/account-service"
import CandidateService from "./services/candidate/candidate-service"
import CareerService from "./services/career/career-service"
import ResumeService from "./services/resume/resume-service"
import CertificateService from "./services/resume/certificate-service"
import ExperienceService from "./services/resume/experience-service"
import EducationService from "./services/resume/education-service"
import LanguageService from "./services/resume/language-service"
import SkillService from "./services/resume/skill-service"
import { BackgroundService } from "./services/common/background-service"
import PackageService from "./services/package/package-service"
import JobPostService from "./services/Job/job-post-service"

const container = createContainer({
    injectionMode: InjectionMode.CLASSIC,
  })

container.register({
  DatabaseService: asClass(DatabaseService).singleton(),
  JwtService: asClass(JwtService).singleton(),
  BackgroundService: asClass(BackgroundService).singleton(),
  AuthService: asClass(AuthService).scoped(),
  RoleService: asClass(RoleService).scoped(),
  CompanyService: asClass(CompanyService).scoped(),
  ProvinceService:asClass(ProvinceService).scoped(),
  UserService:asClass(UserService).scoped(),
  AccountService:asClass(AccountService).scoped(),
  CandidateService: asClass(CandidateService).scoped(),
  CareerService: asClass(CareerService).scoped(),
  ResumeService: asClass(ResumeService).scoped(),
  CertificateService: asClass(CertificateService).scoped(),
  ExperienceService: asClass(ExperienceService).scoped(),
  EducationService: asClass(EducationService).scoped(),
  LanguageService: asClass(LanguageService).scoped(),
  SkillService: asClass(SkillService).scoped(),
  PackageService: asClass(PackageService).scoped(),
  JobPostService: asClass(JobPostService).scoped(),

})
  container.resolve("JwtService")
  container.resolve("DatabaseService")
  container.resolve("BackgroundService").start()

  export default container