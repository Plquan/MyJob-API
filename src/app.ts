import { loadControllers, scopePerRequest } from "awilix-express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from 'cors';
import 'dotenv/config';
import { corsConfig } from "@/common/configs/cors-config";
import container from "./container";
import { Server } from "./server";
import { asyncLocalStorageMiddleware } from "@/common/middlewares";
import { apiLimiter } from "./common/middlewares/RateLimiter";
import errorMiddleware from "./common/middlewares/exception";


/**
 * Application class.
 * @description Handle init config and components.
 */
class Application {
  server!: Server;
  serverInstance: any;
  init() {
    this.initServer();
  }

  private initServer() {
    this.server = new Server();
  }
    start() {
      const port = process.env.APP_PORT || 5001

      this.server.app.use(cors(corsConfig))
      this.server.app.use(cookieParser())
      this.server.app.use(bodyParser.json())
      this.server.app.use(bodyParser.urlencoded({ extended: true }))
      this.server.app.use(scopePerRequest(container))
      this.server.app.use(asyncLocalStorageMiddleware())
      this.server.app.use(apiLimiter)
      this.server.app.use("/api", loadControllers("./controllers/*.*s", { cwd: __dirname }))
      this.server.app.use(errorMiddleware);
      this.serverInstance = this.server.app.listen(port, () =>
        console.log(`Server is running at http://localhost:${port}`)
      )

    }

  close() {
    this.serverInstance.close();
  }

  
}
export default Application;