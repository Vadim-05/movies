import "dotenv/config";
import { z } from "zod";
import { envSchema } from "./env.schema.js";

const DEFAULT_CORS_ORIGINS = ["http://localhost:5173"] as const;
const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    "Invalid environment configuration:\n",
    z.prettifyError(result.error),
  );

  process.exit(1);
}

const config = result.data;

const corsOrigins = [
  ...new Set(
    config.CORS_ORIGINS ??
      (config.NODE_ENV === "development"
        ? DEFAULT_CORS_ORIGINS
        : []),
  ),
];

export const env = Object.freeze({
  nodeEnv: config.NODE_ENV,
  port: config.PORT,
  databaseUrl: config.DATABASE_URL,

  logLevel:
    config.LOG_LEVEL ??
    (config.NODE_ENV === "production" ? "info" : "debug"),

  corsOrigins: Object.freeze(corsOrigins),

  jwtSecretFile: config.JWT_SECRET_FILE,
  jwtIssuer: config.JWT_ISSUER,
  jwtAudience: config.JWT_AUDIENCE,

  refreshTokenTtlDays: config.REFRESH_TOKEN_TTL_DAYS,
  refreshTokenAbsoluteTtlDays:
    config.REFRESH_TOKEN_ABSOLUTE_TTL_DAYS,

  isProduction: config.NODE_ENV === "production",
  isDevelopment: config.NODE_ENV === "development",
  isTest: config.NODE_ENV === "test",
});
