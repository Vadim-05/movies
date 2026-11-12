import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .max(254, "Email must not exceed 254 characters")
  .pipe(z.email({ error: "Invalid email address" }));

const registrationPasswordSchema = z
  .string()
  .min(12, "Password must contain at least 12 characters")
  .max(128, "Password must not exceed 128 characters");

const loginPasswordSchema = z
  .string()
  .min(1, "Password is required")
  .max(128, "Password must not exceed 128 characters");

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must contain at least 3 characters")
  .max(30, "Username must not exceed 30 characters")
  .regex(
    /^[a-z0-9_]+$/,
    "Username may contain only letters, numbers, and underscores",
  );

const nameSchema = z
  .string()
  .trim()
  .min(1, "Name must not be empty")
  .max(80, "Name must not exceed 80 characters");

export const registerSchema = z.strictObject({
  email: emailSchema,
  password: registrationPasswordSchema,
  username: usernameSchema.optional(),
  name: nameSchema.optional(),
});

export const loginSchema = z.strictObject({
  email: emailSchema,
  password: loginPasswordSchema,
});

export const updateProfileSchema = z
  .strictObject({
    email: emailSchema.optional(),
    username: usernameSchema.optional(),
    name: nameSchema.optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "At least one profile field must be provided",
    },
  );

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
