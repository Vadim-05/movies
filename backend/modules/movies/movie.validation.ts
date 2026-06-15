import { z } from "zod";

export const createMovieSchema = z.object({
  name: z.string().min(1),
  rating: z.coerce.number().min(0).max(10),
  description: z.string().min(1),
});

export const updateMovieSchema = createMovieSchema.partial();