import { rateLimit } from "express-rate-limit";

const RATE_LIMIT_RESPONSE = {
  status: "error",
  error: {
    code: "RATE_LIMIT_EXCEEDED",
    message: "Too many requests. Please try again later.",
  },
} as const;

const API_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const API_RATE_LIMIT_MAX_REQUESTS = 100;

export const apiRateLimiter = rateLimit({
  windowMs: API_RATE_LIMIT_WINDOW_MS,
  limit: API_RATE_LIMIT_MAX_REQUESTS,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  statusCode: 429,
  message: RATE_LIMIT_RESPONSE,
});
