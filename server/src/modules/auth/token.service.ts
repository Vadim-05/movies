import { createHash, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { SignJWT, jwtVerify } from "jose";
import { env } from "../../config/env.js";

const JWT_ALGORITHM = "HS256";
const JWT_TYPE = "JWT";

const ACCESS_TOKEN_TTL = "15m";
const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;

const CLOCK_TOLERANCE_SECONDS = 5;

const REFRESH_TOKEN_BYTES = 32;
const MILLISECONDS_PER_DAY = 86_400_000;

const JWT_SECRET_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const USER_ID_PATTERN = /^[1-9]\d*$/;

export interface AccessTokenPayload {
  userId: number;
}

export class InvalidAccessTokenError extends Error {
  constructor() {
    super("Invalid access token");
    this.name = "InvalidAccessTokenError";
  }
}

function loadSigningKey(): Uint8Array {
  let encodedSecret: string;

  try {
    encodedSecret = readFileSync(
      resolve(env.jwtSecretFile),
      "utf8",
    ).replace(/[\r\n]+$/, "");
  } catch (error) {
    throw new Error("Unable to read JWT secret file", {
      cause: error,
    });
  }

  if (!JWT_SECRET_PATTERN.test(encodedSecret)) {
    throw new Error("Invalid JWT secret format");
  }

  const decodedSecret = Buffer.from(
    encodedSecret,
    "base64url",
  );

  if (
    decodedSecret.byteLength !== 32 ||
    decodedSecret.toString("base64url") !== encodedSecret
  ) {
    throw new Error("JWT secret must contain exactly 32 bytes");
  }

  return Uint8Array.from(decodedSecret);
}

const signingKey = loadSigningKey();

export async function createAccessToken(
  userId: number,
): Promise<string> {
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new TypeError("Invalid user ID");
  }

  return new SignJWT({
    tokenType: "access",
  })
    .setProtectedHeader({
      alg: JWT_ALGORITHM,
      typ: JWT_TYPE,
    })
    .setIssuer(env.jwtIssuer)
    .setAudience(env.jwtAudience)
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(signingKey);
}

export async function verifyAccessToken(
  token: string,
): Promise<AccessTokenPayload> {
  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 4096
  ) {
    throw new InvalidAccessTokenError();
  }

  try {
    const { payload, protectedHeader } = await jwtVerify(
      token,
      signingKey,
      {
        algorithms: [JWT_ALGORITHM],
        issuer: env.jwtIssuer,
        audience: env.jwtAudience,
        requiredClaims: ["sub", "iat", "exp"],
        clockTolerance: CLOCK_TOLERANCE_SECONDS,
      },
    );

    if (
      protectedHeader.alg !== JWT_ALGORITHM ||
      protectedHeader.typ !== JWT_TYPE ||
      payload.tokenType !== "access" ||
      typeof payload.sub !== "string" ||
      !USER_ID_PATTERN.test(payload.sub) ||
      typeof payload.iat !== "number" ||
      !Number.isSafeInteger(payload.iat) ||
      typeof payload.exp !== "number" ||
      !Number.isSafeInteger(payload.exp)
    ) {
      throw new InvalidAccessTokenError();
    }

    const userId = Number(payload.sub);

    if (
      !Number.isSafeInteger(userId) ||
      userId <= 0 ||
      String(userId) !== payload.sub
    ) {
      throw new InvalidAccessTokenError();
    }

    const now = Math.floor(Date.now() / 1000);

    if (
      payload.iat > now + CLOCK_TOLERANCE_SECONDS ||
      payload.exp <= payload.iat ||
      payload.exp - payload.iat > ACCESS_TOKEN_TTL_SECONDS
    ) {
      throw new InvalidAccessTokenError();
    }

    return { userId };
  } catch {
    throw new InvalidAccessTokenError();
  }
}

export function createRefreshToken(): string {
  return randomBytes(REFRESH_TOKEN_BYTES).toString("base64url");
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256")
    .update(token, "utf8")
    .digest("hex");
}

function getExpiryDate(
  now: Date,
  ttlDays: number,
  errorMessage: string,
): Date {
  const timestamp = now.getTime();

  if (
    !Number.isSafeInteger(timestamp) ||
    !Number.isSafeInteger(ttlDays) ||
    ttlDays <= 0
  ) {
    throw new TypeError(errorMessage);
  }

  const ttlMilliseconds =
    ttlDays * MILLISECONDS_PER_DAY;

  if (!Number.isSafeInteger(ttlMilliseconds)) {
    throw new TypeError(errorMessage);
  }

  const expiry = new Date(
    timestamp + ttlMilliseconds,
  );

  if (!Number.isFinite(expiry.getTime())) {
    throw new TypeError(errorMessage);
  }

  return expiry;
}

export function getAbsoluteSessionExpiry(
  now: Date = new Date(),
): Date {
  return getExpiryDate(
    now,
    env.refreshTokenAbsoluteTtlDays,
    "Invalid absolute session expiry configuration",
  );
}

export function getRefreshTokenExpiry(
  now: Date,
  absoluteExpiresAt: Date,
): Date {
  const absoluteTimestamp = absoluteExpiresAt.getTime();

  if (
    !Number.isFinite(now.getTime()) ||
    !Number.isFinite(absoluteTimestamp) ||
    absoluteTimestamp <= now.getTime()
  ) {
    throw new TypeError("Invalid absolute session expiry");
  }

  const slidingExpiry = getExpiryDate(
    now,
    env.refreshTokenTtlDays,
    "Invalid refresh token expiry configuration",
  );

  return new Date(
    Math.min(
      slidingExpiry.getTime(),
      absoluteTimestamp,
    ),
  );
}