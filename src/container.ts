import { asClass, createContainer, InjectionMode } from "awilix";
import JwtService from "./services/auth/JwtService";
import AuthService from "./services/auth/AuthService";
import RoleService from "./services/auth/RoleService";
import CompanyService from "./services/company/CompanyService";
import DatabaseService from "./services/database/DatabaseService";
import ProvinceService from "./services/province/ProvinceService";

const container = createContainer({
    injectionMode: InjectionMode.CLASSIC,
  });

  container.register({
    DatabaseService: asClass(DatabaseService).singleton(),
    JwtService: asClass(JwtService).singleton(),
    AuthService: asClass(AuthService).scoped(),
    RoleService: asClass(RoleService).scoped(),
    CompanyService: asClass(CompanyService).scoped(),
    ProvinceService:asClass(ProvinceService).scoped(),

  });
container.resolve("JwtService");
container.resolve("DatabaseService");



  export default container;