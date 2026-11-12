import pino from "pino";
import { env } from "./env.js";

const REDACTED = "[REDACTED]";

const REDACT_PATHS = [
  "req.headers.authorization",
  "req.headers.cookie",
  "req.headers.proxy-authorization",
  "res.headers.set-cookie",

  "password",
  "*.password",
  "passwordHash",
  "*.passwordHash",
  "currentPassword",
  "newPassword",


  "accessToken",
  "*.accessToken",
  "refreshToken",
  "*.refreshToken",
  "token",
  "*.token",
  "tokenHash",
  "*.tokenHash",

  "secret",
  "*.secret",
  "jwtSecret",
  "*.jwtSecret",
  "DATABASE_URL",
  "databaseUrl",
  "connectionString",
  "*.connectionString",
  "apiKey",
  "*.apiKey",
] as const;

export const logger = pino({
  name: "movie-app-api",
  level: env.logLevel,

  redact: {
    paths: [...REDACT_PATHS],
    censor: REDACTED,
  },
});
