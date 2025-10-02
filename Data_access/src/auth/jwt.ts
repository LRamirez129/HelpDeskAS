import jwt from "jsonwebtoken";
import type { Response } from "express";

export type Role = "USER" | "TECH" | "ADMIN";

export interface JWTPayload {
  sub: string;          // id de usuario
  email: string;
  role: Role;
}

export const JWT_COOKIE_NAME = "auth_token";
const isProd = process.env.NODE_ENV === "production";
const JWT_EXPIRES_IN = "8h"; // también puedes usar "1d", etc.

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("Config: falta JWT_SECRET (>=16 chars) en .env");
  }
  return secret;
}

export function signAuthToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAuthToken(token: string): JWTPayload {
  return jwt.verify(token, getJwtSecret()) as JWTPayload;
}

export function setAuthCookie(res: Response, token: string) {
  // 8 horas en milisegundos
  const maxAge = 8 * 60 * 60 * 1000;
  res.cookie(JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,      // en dev puede ir false; en prod TRUE (HTTPS)
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(JWT_COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });
}
