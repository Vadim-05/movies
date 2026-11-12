import argon2 from "argon2";
import { randomBytes } from "node:crypto";

import { AppError } from "../../errors/app-error.js";

import type {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "./auth.schemas.js";

import {
  authRepository,
  isUniqueConstraintViolation,
} from "./auth.repository.js";

import {
  isRefreshSessionActive,
  isRefreshTokenFormatValid,
} from "./auth-session.policy.js";

import {
  createAccessToken,
  createRefreshToken,
  getAbsoluteSessionExpiry,
  getRefreshTokenExpiry,
  hashRefreshToken,
} from "./token.service.js";

const PASSWORD_HASH_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
} as const;

const INVALID_CREDENTIALS_MESSAGE =
  "Invalid email or password";

const DUMMY_PASSWORD = randomBytes(32).toString("base64url");

const dummyPasswordHashPromise = argon2.hash(
  DUMMY_PASSWORD,
  PASSWORD_HASH_OPTIONS,
);

export interface AuthUser {
  id: number;
  email: string;
  username: string | null;
  name: string | null;
}

export interface RegisterResult {
  user: AuthUser;
}

export interface AuthResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

type UserForAuth = AuthUser & {
  passwordHash: string;
};

function toAuthUser(user: UserForAuth): AuthUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
  };
}

function unauthorized(): AppError {
  return new AppError(
    "UNAUTHORIZED",
    INVALID_CREDENTIALS_MESSAGE,
  );
}

function buildAuthResult(
  user: UserForAuth,
  accessToken: string,
  refreshToken: string,
): AuthResult {
  return {
    user: toAuthUser(user),
    accessToken,
    refreshToken,
  };
}

export async function initializeAuthService(): Promise<void> {
  await dummyPasswordHashPromise;
}

export async function register(
  input: RegisterInput,
): Promise<RegisterResult> {
  const passwordHash = await argon2.hash(
    input.password,
    PASSWORD_HASH_OPTIONS,
  );

  try {
    const user = await authRepository.createUser({
      email: input.email,
      passwordHash,
      ...(input.username !== undefined && {
        username: input.username,
      }),
      ...(input.name !== undefined && {
        name: input.name,
      }),
    });

    return {
      user: toAuthUser(user),
    };
  } catch (error: unknown) {
    if (isUniqueConstraintViolation(error)) {
      throw new AppError(
        "CONFLICT",
        "Email or username is already in use",
      );
    }

    throw error;
  }
}

export async function updateProfile(
  userId: number,
  input: UpdateProfileInput,
): Promise<AuthUser> {
  const existingUser = await authRepository.findUserById(userId);

  if (!existingUser) {
    throw new AppError(
      "UNAUTHORIZED",
      "Authentication required",
    );
  }

  const updateData = {
    userId,
    ...(input.email !== undefined && {
      email: input.email,
    }),
    ...(input.username !== undefined && {
      username: input.username,
    }),
    ...(input.name !== undefined && {
      name: input.name,
    }),
  };

  try {
    const updatedUser =
      await authRepository.updateUser(updateData);

    if (!updatedUser) {
      throw new AppError(
        "NOT_FOUND",
        "User not found",
      );
    }

    return toAuthUser(updatedUser);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    if (isUniqueConstraintViolation(error)) {
      throw new AppError(
        "CONFLICT",
        "Email or username is already in use",
      );
    }

    throw error;
  }
}

export async function login(
  input: LoginInput,
): Promise<AuthResult> {
  const user = await authRepository.findUserByEmail(
    input.email,
  );

  const passwordHash = user
    ? user.passwordHash
    : await dummyPasswordHashPromise;

  const passwordMatches = await argon2.verify(
    passwordHash,
    input.password,
  );

  if (!user || !passwordMatches) {
    throw unauthorized();
  }

  const now = new Date();

  const absoluteExpiresAt = getAbsoluteSessionExpiry(now);

  const expiresAt = getRefreshTokenExpiry(
    now,
    absoluteExpiresAt,
  );

  const accessToken = await createAccessToken(user.id);
  const refreshToken = createRefreshToken();

  await authRepository.createSession({
    userId: user.id,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt: expiresAt.toISOString(),
    absoluteExpiresAt: absoluteExpiresAt.toISOString(),
  });

  return buildAuthResult(
    user,
    accessToken,
    refreshToken,
  );
}

export async function refresh(
  refreshToken: string,
): Promise<AuthResult> {
  if (!isRefreshTokenFormatValid(refreshToken)) {
    throw unauthorized();
  }

  const currentTokenHash = hashRefreshToken(refreshToken);

  const session =
    await authRepository.findSessionByTokenHash(
      currentTokenHash,
    );

  if (!session || !isRefreshSessionActive(session)) {
    throw unauthorized();
  }

  const user = await authRepository.findUserById(
    session.userId,
  );

  if (!user) {
    throw unauthorized();
  }

  const now = new Date();

  const absoluteExpiresAt = new Date(
    session.absoluteExpiresAt,
  );

  const nextExpiresAt = getRefreshTokenExpiry(
    now,
    absoluteExpiresAt,
  );

  const accessToken = await createAccessToken(user.id);
  const nextRefreshToken = createRefreshToken();

  const rotationResult = await authRepository.rotateSession({
    sessionId: session.id,
    currentTokenHash,
    nextTokenHash: hashRefreshToken(nextRefreshToken),
    nextExpiresAt: nextExpiresAt.toISOString(),
  });

  if (rotationResult.status !== "rotated") {
    throw unauthorized();
  }

  return buildAuthResult(
    user,
    accessToken,
    nextRefreshToken,
  );
}

export async function logout(
  refreshToken: string,
): Promise<void> {
  if (!isRefreshTokenFormatValid(refreshToken)) {
    return;
  }

  await authRepository.revokeSessionByTokenHash(
    hashRefreshToken(refreshToken),
  );
}

export async function getCurrentUserById(
  userId: number,
): Promise<AuthUser> {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new AppError(
      "UNAUTHORIZED",
      "Authentication required",
    );
  }

  return toAuthUser(user);
}