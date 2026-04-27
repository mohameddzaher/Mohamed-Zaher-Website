import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

mongoose.set("strictQuery", true);

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10_000,
    });
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}
