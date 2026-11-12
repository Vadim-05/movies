
import { Router } from "express";

import { validateBody } from "../../middlewares/validate-body.js";

import {
  loginController,
  logoutController,
  meController,
  refreshController,
  registerController,
  updateProfileController,
} from "./auth.controller.js";

import {
  loginRateLimiter,
  refreshRateLimiter,
  registerRateLimiter,
} from "./auth-rate-limit.js";

import {
  optionalSessionAuth,
  requireAuth,
} from "./auth.middleware.js";

import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  registerRateLimiter,
  validateBody(registerSchema),
  registerController,
);

authRouter.post(
  "/login",
  loginRateLimiter,
  validateBody(loginSchema),
  loginController,
);

authRouter.post(
  "/refresh",
  refreshRateLimiter,
  refreshController,
);

authRouter.post(
  "/logout",
  logoutController,
);

authRouter.get(
  "/me",
  optionalSessionAuth,
  meController,
);

authRouter.patch(
  "/me",
  requireAuth,
  validateBody(updateProfileSchema),
  updateProfileController,
);
