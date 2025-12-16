import { ENV } from "@/common/constants/env";
import { CookieOptions } from "express";

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
} as const;

export const TOKEN_OPTIONS: CookieOptions = {
    ...COOKIE_OPTIONS,
    maxAge: Number(ENV.REFRESH_TOKEN_EXPIRES_IN) * 1000,
};