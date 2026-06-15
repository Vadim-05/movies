import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export const errorHandler = ( err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    requestId: req.headers["x-request-id"],
    message: err.message,
    stack: err.stack,
  });

  if (err.code === "23505") {
    return res.status(409).json({
      success: false,
      code: "DUPLICATE",
      message: "Already exists",
    });
  }

  if (err.code === "23503") {
    return res.status(400).json({
      success: false,
      code: "FOREIGN_KEY",
      message: "Invalid reference",
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal error",
  });
};