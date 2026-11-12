
import type { Request, RequestHandler } from "express";
import { errors as joseErrors } from "jose";

import { AppError } from "../../errors/app-error.js";
import {
  InvalidAccessTokenError,
  verifyAccessToken,
} from "./token.service.js";
import { isRefreshTokenFormatValid } from "./auth-session.policy.js";

const ACCESS_COOKIE_NAME = "accessToken";
const REFRESH_COOKIE_NAME = "refreshToken";
const MAX_ACCESS_TOKEN_LENGTH = 4096;

function unauthorizedError(): AppError {
  return new AppError("UNAUTHORIZED", "Authentication required");
}

function isInvalidAccessTokenError(error: unknown): boolean {
  return (
    error instanceof InvalidAccessTokenError ||
    error instanceof joseErrors.JWTExpired ||
    error instanceof joseErrors.JWTInvalid ||
    error instanceof joseErrors.JWSSignatureVerificationFailed ||
    error instanceof joseErrors.JWTClaimValidationFailed ||
    error instanceof joseErrors.JWSInvalid ||
    error instanceof joseErrors.JOSEAlgNotAllowed
  );
}

async function authenticate(
  req: Request,
  optional = false,
): Promise<void> {
  const token: unknown = req.cookies?.[ACCESS_COOKIE_NAME];

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > MAX_ACCESS_TOKEN_LENGTH
  ) {
    if (optional) return;
    throw unauthorizedError();
  }

  try {
    const payload = await verifyAccessToken(token);
    req.auth = { userId: payload.userId };
  } catch (error: unknown) {
    if (!isInvalidAccessTokenError(error)) {
      throw error;
    }

    if (!optional) {
      throw unauthorizedError();
    }
  }
}

export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    await authenticate(req);
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth: RequestHandler = async (req, _res, next) => {
  try {
    await authenticate(req, true);
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalSessionAuth: RequestHandler = async (
  req,
  _res,
  next,
) => {
  try {
    const accessToken: unknown =
      req.cookies?.[ACCESS_COOKIE_NAME];

    const refreshToken: unknown =
      req.cookies?.[REFRESH_COOKIE_NAME];

    const hasAccessToken =
      typeof accessToken === "string" &&
      accessToken.length > 0;

    const hasRefreshToken =
      isRefreshTokenFormatValid(refreshToken);

    if (!hasAccessToken && !hasRefreshToken) {
      next();
      return;
    }

    await authenticate(req);
    next();
  } catch (error) {
    next(error);
  }
};
