import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export const loggerMiddleware = ( req: Request, _res: Response, next: NextFunction ) => {
  logger.info({
    method: req.method,
    path: req.originalUrl,
    requestId: req.headers["x-request-id"],
  });

  next();
};