import http from "http";
import { createApp } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { initSocket } from "./socket";
import { logger } from "./utils/logger";
import "./scripts/cron";

async function bootstrap() {
  await connectDB();
  const app = createApp();
  const server = http.createServer(app);
  initSocket(server);
  server.listen(env.PORT, () => {
    logger.info(`API listening on http://localhost:${env.PORT}`);
    logger.info(`Allowed CORS origin: ${env.CLIENT_URL}`);
  });
}

bootstrap().catch((err) => {
  logger.error("Bootstrap failed:", err);
  process.exit(1);
});
