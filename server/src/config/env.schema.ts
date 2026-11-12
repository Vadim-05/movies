import { z } from "zod";
const LOG_LEVELS = [
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
  "silent",
] as const;

const REFRESH_TOKEN_TTL_DEFAULT = 7;
const REFRESH_TOKEN_TTL_MAX = 90;

const REFRESH_TOKEN_ABSOLUTE_TTL_DEFAULT = 30;
const REFRESH_TOKEN_ABSOLUTE_TTL_MAX = 365;

function isPostgresUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return (
      (url.protocol === "postgres:" ||
        url.protocol === "postgresql:") &&
      url.hostname.length > 0
    );
  } catch {
    return false;
  }
}

function isValidCorsOrigin(value: string): boolean {
  try {
    const url = new URL(value);

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.origin === value
    );
  } catch {
    return false;
  }
}

const corsOriginSchema = z
  .string()
  .trim()
  .min(1, "CORS origin must not be empty")
  .refine(
    isValidCorsOrigin,
    "CORS origin must be a valid HTTP(S) origin without a path",
  );

const corsOriginsSchema = z.preprocess(
  (value) =>
    typeof value === "string"
      ? value.split(",")
      : value,
  z.array(corsOriginSchema).min(1).optional(),
);

export const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    PORT: z.coerce
      .number()
      .int()
      .min(1)
      .max(65535)
      .default(3000),

    DATABASE_URL: z
      .string()
      .trim()
      .min(1)
      .url()
      .refine(
        isPostgresUrl,
        "DATABASE_URL must be a valid PostgreSQL URL",
      ),

    LOG_LEVEL: z.enum(LOG_LEVELS).optional(),

    CORS_ORIGINS: corsOriginsSchema,

    JWT_SECRET_FILE: z
      .string()
      .trim()
      .min(1, "JWT_SECRET_FILE must not be empty"),

    JWT_ISSUER: z
      .string()
      .trim()
      .min(1)
      .default("movie-app-api"),

    JWT_AUDIENCE: z
      .string()
      .trim()
      .min(1)
      .default("movie-app-client"),

    REFRESH_TOKEN_TTL_DAYS: z.coerce
      .number()
      .int()
      .min(1)
      .max(REFRESH_TOKEN_TTL_MAX)
      .default(REFRESH_TOKEN_TTL_DEFAULT),

    REFRESH_TOKEN_ABSOLUTE_TTL_DAYS: z.coerce
      .number()
      .int()
      .min(1)
      .max(REFRESH_TOKEN_ABSOLUTE_TTL_MAX)
      .default(REFRESH_TOKEN_ABSOLUTE_TTL_DEFAULT),
  })
  .superRefine((config, ctx) => {
    if (
      config.REFRESH_TOKEN_ABSOLUTE_TTL_DAYS <
      config.REFRESH_TOKEN_TTL_DAYS
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["REFRESH_TOKEN_ABSOLUTE_TTL_DAYS"],
        message:
          "Absolute refresh token TTL must be greater than or equal to refresh token TTL",
      });
    }

    if (config.NODE_ENV === "production") {
      if (!config.CORS_ORIGINS?.length) {
        ctx.addIssue({
          code: "custom",
          path: ["CORS_ORIGINS"],
          message: "CORS_ORIGINS must be configured in production",
        });
      } else {
        config.CORS_ORIGINS.forEach((origin, index) => {
          if (!origin.startsWith("https://")) {
            ctx.addIssue({
              code: "custom",
              path: ["CORS_ORIGINS", index],
              message: "Production CORS origins must use HTTPS",
            });
          }
        });
      }

      if (
        config.LOG_LEVEL === "debug" ||
        config.LOG_LEVEL === "trace"
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["LOG_LEVEL"],
          message:
            "Debug and trace logging are not allowed in production",
        });
      }
    }
  });

export type EnvConfig = z.infer<typeof envSchema>;
