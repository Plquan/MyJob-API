import { asClass, createContainer, InjectionMode } from "awilix";
import JwtService from "./services/auth/JwtService";

const container = createContainer({
    injectionMode: InjectionMode.CLASSIC,
  });

  container.register({
    JwtService: asClass(JwtService).singleton(),
  });

  export default container;