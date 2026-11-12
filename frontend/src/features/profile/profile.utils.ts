
import { isAxiosError } from "axios";
import { z } from "zod";
import type { AuthUser, UpdateProfileInput } from "../auth/auth.types";
import type { ProfileFormValues } from "./profile.types";

const emailSchema = z.email();
const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/;

function normalizeForm(form: ProfileFormValues) {
  return {
    email: form.email.trim().toLowerCase(),
    username: form.username.trim().toLowerCase(),
    name: form.name.trim(),
  };
}

export function getInitialProfileForm(user: AuthUser): ProfileFormValues {
  return {
    email: user.email,
    username: user.username ?? "",
    name: user.name ?? "",
  };
}

export function validateProfileForm(
  form: ProfileFormValues,
  user: AuthUser,
): string | null {
  const { email, username, name } = normalizeForm(form);

  if (!email) return "Email is required.";
  if (!emailSchema.safeParse(email).success) return "Please enter a valid email address.";

  if (username && !USERNAME_REGEX.test(username)) {
    return "Username must be 3–30 characters long and contain only Latin letters, numbers, or underscores.";
  }

  if (name.length > 80) return "Name must not exceed 80 characters.";
  if (user.username && !username) return "Username cannot be empty.";
  if (user.name && !name) return "Name cannot be empty.";

  return null;
}

export function createProfileUpdatePayload(
  form: ProfileFormValues,
  user: AuthUser,
): UpdateProfileInput | null {
  const { email, username, name } = normalizeForm(form);
  const payload: UpdateProfileInput = {};

  if (email !== user.email) payload.email = email;
  if (username !== (user.username ?? "")) payload.username = username;
  if (name !== (user.name ?? "")) payload.name = name;

  return Object.keys(payload).length ? payload : null;
}

export function getProfileUpdateError(error: unknown): string {
  if (!isAxiosError(error)) {
    return "Failed to update profile. Please try again.";
  }

  if (error.response?.status === 409) {
    return "This email or username is already in use.";
  }

  if (error.response?.status === 400) {
    return "Please check that the information you entered is correct.";
  }

  const data = error.response?.data;
  const message = data?.error?.message ?? data?.message;

  return typeof message === "string" && message.trim()
    ? message
    : "Failed to update profile. Please try again.";
}
