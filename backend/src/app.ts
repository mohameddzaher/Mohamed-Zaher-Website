import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { generalLimiter } from "./middleware/rateLimit";

export function createApp(): Application {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: false,
    }),
  );
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(mongoSanitize());
  if (env.NODE_ENV !== "test") app.use(morgan("dev"));
  app.use(generalLimiter);

  app.get("/", (_req, res) =>
    res.json({
      name: "Mohamed Zaher Platform API",
      version: "0.1.0",
      docs: "/api/health",
    }),
  );

  app.use("/api", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
