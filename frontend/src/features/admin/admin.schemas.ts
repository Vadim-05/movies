import { z } from "zod";

export const MAX_SEARCH_LENGTH = 100;

export const adminSearchSchema = z.object({
  search: z.string().trim().max(MAX_SEARCH_LENGTH).catch("").default(""),
  page: z.number().int().positive().catch(1).default(1),
});

export const adminMoviesSearchSchema = adminSearchSchema.extend({
  genreIds: z.array(z.number().int().positive()).catch([]).default([]),
});

export type AdminSearch = z.infer<typeof adminSearchSchema>;
export type AdminMoviesSearch = z.infer<typeof adminMoviesSearchSchema>;