import { asClass, createContainer, InjectionMode } from "awilix";
import JwtService from "./services/auth/JwtService";
import AuthService from "./services/auth/AuthService";
import RoleService from "./services/manager/RoleService";
import CompanyService from "./services/manager/CompanyService";
import DatabaseService from "./services/common/DatabaseService";
import ProvinceService from "./services/manager/ProvinceService";
import UserService from "./services/manager/UserService";
import AccountService from "./services/manager/AccountService";
import CandidateService from "./services/manager/CandidateService";
import CareerService from "./services/manager/CareerService";

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
    CareerService: asClass(CareerService).scoped()

  })
container.resolve("JwtService")
container.resolve("DatabaseService")



  export default container;