const REFRESH_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export interface RefreshSessionState {
  expiresAt: string;
  absoluteExpiresAt: string;
  revokedAt: string | null;
}

export function isRefreshTokenFormatValid(
  token: unknown,
): token is string {
  return (
    typeof token === "string" &&
    REFRESH_TOKEN_PATTERN.test(token)
  );
}

export function isRefreshSessionActive(
  session: RefreshSessionState,
  now: number = Date.now(),
): boolean {
  if (!Number.isFinite(now) || session.revokedAt !== null) {
    return false;
  }

  const expiresAt = Date.parse(session.expiresAt);
  const absoluteExpiresAt = Date.parse(session.absoluteExpiresAt);

  return (
    Number.isFinite(expiresAt) &&
    Number.isFinite(absoluteExpiresAt) &&
    expiresAt > now &&
    absoluteExpiresAt > now &&
    expiresAt <= absoluteExpiresAt
  );
}
