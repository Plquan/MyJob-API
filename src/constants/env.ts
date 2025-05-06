import "dotenv/config"

export const ENV = {
    APP_PORT: process.env.APP_PORT || 3000,

    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 3306,
    DB_NAME: process.env.DB_NAME || 'test',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASS: process.env.DB_PASS || '',

    SECRET_KEY: process.env.SECRET_KEY || "secret",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "1d",
    

}