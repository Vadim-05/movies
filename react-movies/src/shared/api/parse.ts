import { z } from "zod";
import { ValidationError } from "@/shared/api/error";

export function parse<T extends z.ZodTypeAny>( schema: T,data: unknown): z.infer<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ValidationError(result.error);
  }

  return result.data;
}