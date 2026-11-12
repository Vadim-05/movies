import { ZodError } from "zod";
import type {
  ErrorRequestHandler,
  RequestHandler,
  Response,
} from "express";

import { logger } from "../config/logger.js";
import {
  AppError,
  type AppErrorCode,
} from "../errors/app-error.js";

interface ErrorResponse {
  status: "error";
  error: {
    code: AppErrorCode;
    message: string;
  };
}

interface DatabaseError {
  sqlState?: unknown;
  cause?: unknown;
}

interface HttpError {
  type?: string;
}

function sendError(
  res: Response,
  statusCode: number,
  code: AppErrorCode,
  message: string,
): void {
  res.status(statusCode).json({
    status: "error",
    error: { code, message },
  } satisfies ErrorResponse);
}

function getSqlState(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) return undefined;

  const { sqlState, cause } = error as DatabaseError;

  if (typeof sqlState === "string") return sqlState;

  if (
    typeof cause === "object" &&
    cause !== null &&
    "sqlState" in cause &&
    typeof cause.sqlState === "string"
  ) {
    return cause.sqlState;
  }

  return undefined;
}

export const notFoundHandler: RequestHandler = (
  req,
  _res,
  next,
) => {
  next(
    new AppError(
      "NOT_FOUND",
      `Route ${req.method} ${req.path} not found.`,
    ),
  );
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  req,
  res,
  next,
): void => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof AppError) {
    sendError(res, error.statusCode, error.code, error.message);
    return;
  }

  if (error instanceof ZodError) {
    sendError(res, 400, "VALIDATION_ERROR", "Invalid request data.");
    return;
  }

  if (typeof error === "object" && error !== null) {
    const { type } = error as HttpError;

    if (type === "entity.parse.failed") {
      sendError(res, 400, "VALIDATION_ERROR", "Invalid JSON request body.");
      return;
    }

    if (type === "entity.too.large") {
      sendError(res, 413, "PAYLOAD_TOO_LARGE", "Request body is too large.");
      return;
    }
  }

  switch (getSqlState(error)) {
    case "23503":
      sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "One or more referenced records do not exist.",
      );
      return;

    case "23505":
      sendError(
        res,
        409,
        "CONFLICT",
        "A record with these values already exists.",
      );
      return;
  }

  logger.error(
    {
      err: error,
      method: req.method,
      path: req.path,
    },
    "Unhandled request error",
  );

  sendError(
    res,
    500,
    "INTERNAL_SERVER_ERROR",
    "An unexpected error occurred.",
  );
};