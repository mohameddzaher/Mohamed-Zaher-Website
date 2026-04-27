import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export type JwtPayload = {
  sub: string;
  role: "admin" | "client";
  email: string;
};

export function signAccess(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES,
  } as SignOptions);
}

export function signRefresh(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES,
  } as SignOptions);
}

export function verifyAccess(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}

export function verifyRefresh(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}
