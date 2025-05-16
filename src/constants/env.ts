import "dotenv/config"

export const ENV = {
    APP_PORT: process.env.APP_PORT || 5500,

    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 3306,
    DB_NAME: process.env.DB_NAME || 'test',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASS: process.env.DB_PASS || '',

    PASSWORD_SALT: process.env.PASSWORD_SALT || 10,

    SECRET_KEY: process.env.SECRET_KEY || "secret",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "1d",
    

}