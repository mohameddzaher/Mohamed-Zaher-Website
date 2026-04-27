import type { Request, Response, NextFunction } from "express";
import { verifyAccess, type JwtPayload } from "../services/jwt";
import { ApiError } from "../utils/ApiError";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

function extractToken(req: Request): string | null {
  const cookieToken = req.cookies?.["mz_access"];
  if (cookieToken) return cookieToken;
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next(ApiError.unauthorized());
  try {
    req.user = verifyAccess(token);
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}

export function requireRole(...roles: ("admin" | "client")[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
    next();
  };
}

export const requireAdmin = [requireAuth, requireRole("admin")];
