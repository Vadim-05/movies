import type { RequestHandler } from "express";
import type { z } from "zod";
import { AppError } from "../errors/app-error.js";

export function validateBody(schema: z.ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(
        new AppError(
          "VALIDATION_ERROR",
          "Invalid request body",
        ),
      );
      return;
    }

    req.body = result.data;
    next();
  };
}
