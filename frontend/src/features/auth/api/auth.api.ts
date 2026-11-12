
import { api } from "../../../lib/api";

import type {
  AuthUser,
  AuthUserResponse,
  CurrentUserResponse,
  UpdateProfileInput,
} from "../auth.types";

import type {
  LoginOutput,
  RegisterOutput,
} from "../auth.schemas";

async function getUserFromResponse(
  request: Promise<{ data: AuthUserResponse }>,
): Promise<AuthUser> {
  const { data } = await request;
  return data.user;
}

export function register(input: RegisterOutput): Promise<AuthUser> {
  return getUserFromResponse(
    api.post<AuthUserResponse>("/auth/register", input),
  );
}

export function login(input: LoginOutput): Promise<AuthUser> {
  return getUserFromResponse(
    api.post<AuthUserResponse>("/auth/login", input),
  );
}

export function refresh(): Promise<AuthUser> {
  return getUserFromResponse(
    api.post<AuthUserResponse>("/auth/refresh"),
  );
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getCurrentUser(
  signal?: AbortSignal,
): Promise<AuthUser | null> {
  const { data } = await api.get<CurrentUserResponse>(
    "/auth/me",
    { signal },
  );

  return data.user;
}

export function updateProfile(
  input: UpdateProfileInput,
): Promise<AuthUser> {
  return getUserFromResponse(
    api.patch<AuthUserResponse>("/auth/me", input),
  );
}
