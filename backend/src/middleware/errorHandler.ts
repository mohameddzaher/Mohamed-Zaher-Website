import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { MongoServerError } from "mongodb";
import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";
import { isProd } from "../config/env";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound("Route not found"));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
  }
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }
  if (err instanceof MongoServerError && err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value",
      details: err.keyValue,
    });
  }
  logger.error(err);
  const status = (err as { status?: number; statusCode?: number })?.status
    ?? (err as { statusCode?: number })?.statusCode
    ?? 500;
  res.status(status).json({
    success: false,
    message: (err as Error).message ?? "Internal Server Error",
    ...(isProd ? {} : { stack: (err as Error).stack }),
  });
}
