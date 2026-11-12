import { randomUUID } from "node:crypto";
import { pinoHttp } from "pino-http";
import { logger } from "../config/logger.js";

export const requestLogger = pinoHttp({
  logger,

  genReqId(_req, res) {
    const requestId = randomUUID();
    res.setHeader("X-Request-Id", requestId);
    return requestId;
  },

  customLogLevel(_req, res, error) {
    
    if (error || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";

    return "info";
  },
});
