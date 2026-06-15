import { z } from "zod";

export const movieSchema = z.object({
  id: z.number(),
  name: z.string(),
  rating: z.coerce.number(),
  description: z.string(),
  image: z.string(),
  is_favorite: z.boolean(),
});

export const moviesSchema = z.object({
  data: z.array(movieSchema),
  nextCursor: z.number().nullable(),
});