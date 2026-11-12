import type {
  Request,
  RequestHandler,
  Response,
} from "express";
import { env } from "../../config/env.js";
import { AppError } from "../../errors/app-error.js";
import * as authService from "./auth.service.js";
import type { AuthResult } from "./auth.service.js";
import type {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "./auth.schemas.js";
import { isRefreshTokenFormatValid } from "./auth-session.policy.js";

const ACCESS_COOKIE_NAME = "accessToken";
const REFRESH_COOKIE_NAME = "refreshToken";

const MILLISECONDS_PER_SECOND = 1_000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

const MILLISECONDS_PER_DAY =
  MILLISECONDS_PER_SECOND *
  SECONDS_PER_MINUTE *
  MINUTES_PER_HOUR *
  HOURS_PER_DAY;

const ACCESS_TOKEN_TTL_MS = 15 * SECONDS_PER_MINUTE *
  MILLISECONDS_PER_SECOND;

const ACCESS_COOKIE_PATH = "/";
const REFRESH_COOKIE_PATH = "/api/auth";

const COMMON_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? "none" as const : "lax" as const,
};

const ACCESS_COOKIE_OPTIONS = {
  ...COMMON_COOKIE_OPTIONS,
  path: ACCESS_COOKIE_PATH,
  maxAge: ACCESS_TOKEN_TTL_MS,
};

const REFRESH_COOKIE_OPTIONS = {
  ...COMMON_COOKIE_OPTIONS,
  path: REFRESH_COOKIE_PATH,
  maxAge:
    env.refreshTokenTtlDays * MILLISECONDS_PER_DAY,
};

const CLEAR_ACCESS_COOKIE_OPTIONS = {
  ...COMMON_COOKIE_OPTIONS,
  path: ACCESS_COOKIE_PATH,
};

const CLEAR_REFRESH_COOKIE_OPTIONS = {
  ...COMMON_COOKIE_OPTIONS,
  path: REFRESH_COOKIE_PATH,
};

type AsyncController = (
  req: Request,
  res: Response,
) => Promise<void>;

function asyncHandler(
  handler: AsyncController,
): RequestHandler {
  return (req, res, next): void => {
    void handler(req, res).catch(next);
  };
}

function setNoStoreHeader(res: Response): void {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
}

function setAuthCookies(
  res: Response,
  result: AuthResult,
): void {
  res.cookie(
    ACCESS_COOKIE_NAME,
    result.accessToken,
    ACCESS_COOKIE_OPTIONS,
  );

  res.cookie(
    REFRESH_COOKIE_NAME,
    result.refreshToken,
    REFRESH_COOKIE_OPTIONS,
  );
}

function clearAuthCookies(res: Response): void {
  res.clearCookie(
    ACCESS_COOKIE_NAME,
    CLEAR_ACCESS_COOKIE_OPTIONS,
  );

  res.clearCookie(
    REFRESH_COOKIE_NAME,
    CLEAR_REFRESH_COOKIE_OPTIONS,
  );
}

function sendAuthResponse(
  res: Response,
  result: AuthResult,
): void {
  setNoStoreHeader(res);
  setAuthCookies(res, result);

  res.status(200).json({
    user: result.user,
  });
}

function getRefreshToken(req: Request): string {
  const token: unknown =
    req.cookies?.[REFRESH_COOKIE_NAME];

  if (!isRefreshTokenFormatValid(token)) {
    throw new AppError(
      "UNAUTHORIZED",
      "Refresh token is required or invalid",
    );
  }
  return token;
}

function getAuthenticatedUserId(req: Request): number {
  const userId = req.auth?.userId;
  if (
    typeof userId !== "number" ||
    !Number.isSafeInteger(userId) ||
    userId <= 0
  ) {
    throw new AppError(
      "UNAUTHORIZED",
      "Authentication required",
    );
  }
  return userId;
}

export const registerController: RequestHandler =
  asyncHandler(async (req, res) => {
    const result = await authService.register(
      req.body as RegisterInput,
    );
    setNoStoreHeader(res);
    res.status(201).json(result);
});

export const loginController: RequestHandler =
  asyncHandler(async (req, res) => {
    const result = await authService.login(
      req.body as LoginInput,
    );
    sendAuthResponse(res, result);
});

export const refreshController: RequestHandler =
  asyncHandler(async (req, res) => {
    const refreshToken = getRefreshToken(req);
    const result =
      await authService.refresh(refreshToken);
    sendAuthResponse(res, result);
});

export const logoutController: RequestHandler =
  asyncHandler(async (req, res) => {
    const token: unknown =
      req.cookies?.[REFRESH_COOKIE_NAME];

    if (isRefreshTokenFormatValid(token)) {
      await authService.logout(token);
    }

    setNoStoreHeader(res);
    clearAuthCookies(res);
    res.status(204).send();
});


export const meController: RequestHandler =
  asyncHandler(async (req, res) => {
    setNoStoreHeader(res);

    const userId = req.auth?.userId;

    if (!userId) {
      res.status(200).json({ user: null });
      return;
    }

    const user =
      await authService.getCurrentUserById(userId);

    res.status(200).json({ user });
  });

  
export const updateProfileController: RequestHandler =
  asyncHandler(async (req, res) => {
    const userId = getAuthenticatedUserId(req);

    const user = await authService.updateProfile(
      userId,
      req.body as UpdateProfileInput,
    );

    setNoStoreHeader(res);

    res.status(200).json({ user });
});
