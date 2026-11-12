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

function optionalField<T extends z.ZodType>(schema: T) {
  return z
    .union([schema, z.literal("")])
    .transform((value) => (value === "" ? undefined : value))
    .optional();
}

export const registerSchema = z.strictObject({
  email: emailSchema,
  password: registrationPasswordSchema,
  username: optionalField(usernameSchema),
  name: optionalField(nameSchema),
});

export const loginSchema = z.strictObject({
  email: emailSchema,
  password: loginPasswordSchema,
});

export type RegisterInput = z.input<typeof registerSchema>;
export type RegisterOutput = z.output<typeof registerSchema>;

export type LoginInput = z.input<typeof loginSchema>;
export type LoginOutput = z.output<typeof loginSchema>;
