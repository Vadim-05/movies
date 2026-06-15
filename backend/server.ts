import app from "./app";
import { env } from "./config/env";
import logger from "./config/logger";
import { close } from "./config/db";

const server = app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}`);
});

process.on("SIGINT", async () => {
  server.close(async () => {
    await close();
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  server.close(async () => {
    await close();
    process.exit(0);
  });
});