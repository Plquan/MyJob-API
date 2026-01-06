import "dotenv/config"

export const ENV = {
    APP_PORT: process.env.APP_PORT || 5500,
    AUTH_MODE: process.env.AUTH_MODE || "COOKIE",

    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 5432,
    DB_NAME: process.env.DB_NAME || 'test',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASS: process.env.DB_PASS || '',

    PASSWORD_SALT: process.env.PASSWORD_SALT || 10,

    SECRET_KEY: process.env.SECRET_KEY || "secret",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || 3600,

    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || 604800,
    
    MAILTRAP_HOST: process.env.MAILTRAP_HOST,
    MAILTRAP_PORT: Number(process.env.MAILTRAP_PORT),
    MAILTRAP_USER: process.env.MAILTRAP_USER ,
    MAILTRAP_PASS: process.env.MAILTRAP_PASS ,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
}