import { rateLimit } from "express-rate-limit";

const RATE_LIMIT_RESPONSE = {
  status: "error",
  error: {
    code: "RATE_LIMIT_EXCEEDED",
    message: "Too many requests. Please try again later.",
  },
} as const;

const AUTH_RATE_LIMITS = {
  login: {
    windowMs: 15 * 60 * 1000,
    limit: 5,
    identifier: "auth-login",
  },
  register: {
    windowMs: 60 * 60 * 1000,
    limit: 10,
    identifier: "auth-register",
  },
  refresh: {
    windowMs: 15 * 60 * 1000,
    limit: 30,
    identifier: "auth-refresh",
  },
} as const;

function createAuthRateLimiter(
  config: (typeof AUTH_RATE_LIMITS)[keyof typeof AUTH_RATE_LIMITS],
) {
  return rateLimit({
    windowMs: config.windowMs,
    limit: config.limit,
    identifier: config.identifier,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    statusCode: 429,
    message: RATE_LIMIT_RESPONSE,
  });
}

export const loginRateLimiter = createAuthRateLimiter(
  AUTH_RATE_LIMITS.login,
);

export const registerRateLimiter = createAuthRateLimiter(
  AUTH_RATE_LIMITS.register,
);

export const refreshRateLimiter = createAuthRateLimiter(
  AUTH_RATE_LIMITS.refresh,
);
