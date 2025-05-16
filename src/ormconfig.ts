import { DataSource } from "typeorm";
import { ENV } from "./constants/env";

const dataSource = new DataSource({
    type: 'mysql',
    host: ENV.DB_HOST,
    port: Number(ENV.DB_PORT) || 3306,
    username: ENV.DB_USER,
    password: ENV.DB_PASS,
    database: ENV.DB_NAME,
    entities: [__dirname + '/entity/**/*.{js,ts}'],
    migrations: [__dirname + '/migrations/**/*.{js,ts}'],
    migrationsTableName: 'Migrations',
    migrationsRun: false,
    synchronize: false,
    poolSize: 10,
    logging: ["query", "error", "info", "warn"],
})

export default dataSource;