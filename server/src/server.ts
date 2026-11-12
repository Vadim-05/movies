import { createServer } from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import {closeDatabase,connectDatabase} from "./prisma/db-lifecycle.js";

const SHUTDOWN_TIMEOUT_MS = 10_000;

const server = createServer(app);

let shuttingDown = false;
let shutdownTimer: NodeJS.Timeout | undefined;

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) {
    logger.warn({ signal }, "Shutdown already in progress");
    return;
  }

  shuttingDown = true;
  logger.info({ signal }, "Graceful shutdown started");

  shutdownTimer = setTimeout(() => {
    logger.fatal("Graceful shutdown timed out");
    server.closeAllConnections();
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  try {
    if (server.listening) {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }

    await closeDatabase();
    logger.info("Graceful shutdown completed");
  } catch (error) {
    logger.error({ err: error }, "Graceful shutdown failed");
    process.exitCode = 1;
  } finally {
    if (shutdownTimer) {
      clearTimeout(shutdownTimer);
      shutdownTimer = undefined;
    }
  }
}

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    if (shuttingDown) {
      await closeDatabase();
      return;
    }

    server.listen(env.port, () => {
      logger.info(
        { port: env.port, environment: env.nodeEnv },
        "HTTP server started",
      );
    });
  } catch (error) {
    logger.fatal({ err: error }, "Server startup failed");

    try {
      await closeDatabase();
    } catch (closeError) {
      logger.error({ err: closeError }, "Database cleanup failed");
    }

    process.exitCode = 1;
  }
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));

server.on("error", (error) => {
  logger.fatal({ err: error }, "HTTP server error");
  void shutdown("SERVER_ERROR");
});

void startServer();
