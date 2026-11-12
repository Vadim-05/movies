
import { logger } from "../config/logger.js";
import { db } from "./db.js";

type DatabaseState =
  | "idle"
  | "connecting"
  | "connected"
  | "closing"
  | "closed";

let state: DatabaseState = "idle";
let connectPromise: Promise<void> | undefined;
let closePromise: Promise<void> | undefined;

export function connectDatabase(): Promise<void> {
  if (state === "closing" || state === "closed") {
    return Promise.reject(
      new Error("Database is shutting down or has been closed"),
    );
  }

  if (state === "connected") return Promise.resolve();
  if (connectPromise) return connectPromise;

  state = "connecting";

  connectPromise = db
    .connect()
    .then(() => {
      if (state !== "connecting") {
        throw new Error(
          "Database connection completed after shutdown started",
        );
      }

      state = "connected";
      logger.info("Database connection established");
    })
    .catch((error: unknown) => {
      if (state === "connecting") {
        state = "idle";
      }

      throw error;
    })
    .finally(() => {
      connectPromise = undefined;
    });

  return connectPromise;
}

export function closeDatabase(): Promise<void> {
  
  if (closePromise) return closePromise;
  if (state === "closed") return Promise.resolve();

  state = "closing";

  closePromise = (async () => {
    if (connectPromise) {
      await connectPromise.catch((error: unknown) => {
        logger.warn(
          { err: error },
          "Database connection failed during shutdown",
        );
      });
    }

    await db.close();

    state = "closed";
    logger.info("Database connection closed");
  })().catch((error: unknown) => {
    state = "closing";
    closePromise = undefined;
    logger.error({ err: error }, "Failed to close database connection");
    throw error;
  });

  return closePromise;
}
