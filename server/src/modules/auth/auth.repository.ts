import { db } from "../../prisma/db.js";

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  username?: string;
  name?: string;
}

export interface UpdateUserInput {
  userId: number;
  email?: string;
  username?: string;
  name?: string;
}

export interface CreateSessionInput {
  userId: number;
  tokenHash: string;
  expiresAt: string;
  absoluteExpiresAt: string;
}

export interface RotateSessionInput {
  sessionId: string;
  currentTokenHash: string;
  nextTokenHash: string;
  nextExpiresAt: string;
}

type UserRecord = NonNullable<
  Awaited<ReturnType<typeof db.orm.public.User.first>>
>;

type SessionRecord = NonNullable<
  Awaited<ReturnType<typeof db.orm.public.AuthSession.first>>
>;

export type RotateSessionResult =
  | {
      status: "rotated";
      session: SessionRecord;
    }
  | {
      status: "reused";
    }
  | {
      status: "invalid";
    };

export interface AuthRepository {
  findUserByEmail(email: string): Promise<UserRecord | null>;

  findUserById(userId: number): Promise<UserRecord | null>;

  createUser(input: CreateUserInput): Promise<UserRecord>;

  updateUser(input: UpdateUserInput): Promise<UserRecord | null>;

  createSession(input: CreateSessionInput): Promise<SessionRecord>;

  findSessionByTokenHash(
    tokenHash: string,
  ): Promise<SessionRecord | null>;

  rotateSession(
    input: RotateSessionInput,
  ): Promise<RotateSessionResult>;

  revokeSessionByTokenHash(tokenHash: string): Promise<boolean>;

  revokeAllUserSessions(userId: number): Promise<void>;
}

const users = db.orm.public.User;
const sessions = db.orm.public.AuthSession;

function toTimestamp(value: string): string {
  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    throw new TypeError("Invalid timestamp");
  }

  return new Date(timestamp).toISOString();
}

export const authRepository: AuthRepository = {
  findUserByEmail(email) {
    return users.first({ email });
  },

  findUserById(userId) {
    return users.first({ id: userId });
  },

  createUser(input) {
    return users.create({
      email: input.email,
      passwordHash: input.passwordHash,
      username: input.username ?? null,
      name: input.name ?? null,
    });
  },

  async updateUser({ userId, ...data }) {
    if (Object.keys(data).length === 0) {
      return null;
    }

    return users.where({ id: userId }).update(data);
  },

  createSession(input) {
    return sessions.create({
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: toTimestamp(input.expiresAt),
      absoluteExpiresAt: toTimestamp(input.absoluteExpiresAt),
      revokedAt: null,
    });
  },

  findSessionByTokenHash(tokenHash) {
    return sessions.first({ tokenHash });
  },

  async rotateSession({
    sessionId,
    currentTokenHash,
    nextTokenHash,
    nextExpiresAt,
  }) {
    const now = new Date().toISOString();
    const nextExpiry = toTimestamp(nextExpiresAt);

    return db.transaction(async (tx) => {
      const updatedSession = await tx.orm.public.AuthSession
        .where({
          id: sessionId,
          tokenHash: currentTokenHash,
          revokedAt: null,
        })
        .where((session) => session.expiresAt.gt(now))
        .where((session) => session.absoluteExpiresAt.gt(now))
        .update({
          tokenHash: nextTokenHash,
          expiresAt: nextExpiry,
        });

      if (updatedSession !== null) {
        await tx.orm.public.UsedRefreshToken.create({
          sessionId,
          tokenHash: currentTokenHash,
        });

        return {
          status: "rotated",
          session: updatedSession,
        };
      }

      const previouslyUsedToken =
        await tx.orm.public.UsedRefreshToken.first({
          sessionId,
          tokenHash: currentTokenHash,
        });

      if (previouslyUsedToken) {
        await tx.orm.public.AuthSession
          .where({
            id: sessionId,
            revokedAt: null,
          })
          .update({
            revokedAt: now,
          });

        return {
          status: "reused",
        };
      }

      return {
        status: "invalid",
      };
    });
  },

  async revokeSessionByTokenHash(tokenHash) {
    const revoked = await sessions
      .where({
        tokenHash,
        revokedAt: null,
      })
      .update({
        revokedAt: new Date().toISOString(),
      });

    return revoked !== null;
  },

  async revokeAllUserSessions(userId) {
    await sessions
      .where({
        userId,
        revokedAt: null,
      })
      .updateAndCount({
        revokedAt: new Date().toISOString(),
      });
  },
};

export function isUniqueConstraintViolation(
  error: unknown,
): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "sqlState" in error &&
    error.sqlState === "23505"
  );
}