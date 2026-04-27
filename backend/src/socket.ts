import { Server as IOServer } from "socket.io";
import type { Server as HttpServer } from "http";
import { env } from "./config/env";
import { verifyAccess } from "./services/jwt";
import { logger } from "./utils/logger";

let io: IOServer | null = null;

export function initSocket(server: HttpServer): IOServer {
  io = new IOServer(server, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  });

  io.on("connection", (socket) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (token) {
      try {
        const payload = verifyAccess(token);
        socket.data.user = payload;
        socket.join(`user:${payload.sub}`);
        if (payload.role === "client") socket.join(`client:${payload.sub}`);
        if (payload.role === "admin") socket.join("admins");
      } catch {
        /* anonymous */
      }
    }
    logger.info(`Socket connected: ${socket.id}`);
    socket.on("disconnect", () => logger.info(`Socket disconnected: ${socket.id}`));
  });

  return io;
}

export function getIO(): IOServer {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
