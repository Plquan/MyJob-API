import { asClass, createContainer, InjectionMode } from "awilix"
import JwtService from "./services/auth/JwtService"
import AuthService from "./services/auth/AuthService"
import RoleService from "./services/manager/RoleService"
import CompanyService from "./services/manager/CompanyService"
import DatabaseService from "./services/common/DatabaseService"
import ProvinceService from "./services/manager/ProvinceService"
import UserService from "./services/manager/UserService"
import AccountService from "./services/manager/AccountService"
import CandidateService from "./services/manager/CandidateService"
import CareerService from "./services/manager/CareerService"
import ResumeService from "./services/manager/ResumeService"
import CertificateService from "./services/manager/CertificateService"
import ExperienceService from "./services/manager/ExperienceService"
import EducationService from "./services/manager/EducationService"
import LanguageService from "./services/manager/LanguageService"
import SkillService from "./services/manager/SkillService"
import { BackgroundService } from "./services/common/BackgroundService"

const container = createContainer({
    injectionMode: InjectionMode.CLASSIC,
  })

container.register({
  DatabaseService: asClass(DatabaseService).singleton(),
  JwtService: asClass(JwtService).singleton(),
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
  BackgroundService: asClass(BackgroundService).scoped()

})
  container.resolve("JwtService")
  container.resolve("DatabaseService")
  container.resolve("BackgroundService").start()

  export default container