import { z } from "zod";
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "./movies.constants.js";

const positiveIntegerString = z
  .string()
  .regex(/^[1-9]\d*$/)
  .transform(Number)
  .pipe(z.int32().positive());

const pageSizeSchema = positiveIntegerString
  .default(DEFAULT_PAGE_SIZE)
  .pipe(z.int32().positive().max(MAX_PAGE_SIZE));

const genresQuerySchema = z
  .string()
  .trim()
  .min(1)
  .max(219)
  .transform((value) => value.split(","))
  .pipe(z.array(positiveIntegerString).min(1).max(20))
  .refine((ids) => new Set(ids).size === ids.length, {
    error: "Genre IDs must be unique.",
  })
  .optional()
  .default([]);

export const moviesQuerySchema = z
  .strictObject({
    page: positiveIntegerString.default(1),
    pageSize: pageSizeSchema,
    search: z
      .string()
      .trim()
      .max(100)
      .transform((value) => value || undefined)
      .optional(),
    genres: genresQuerySchema,
  })
  .refine(
    ({ page, pageSize }) =>
      Number.isSafeInteger((page - 1) * pageSize),
    {
      path: ["page"],
      error: "Page is too large.",
    },
  );

export const recommendationsQuerySchema = z.strictObject({
  limit: pageSizeSchema,
});

export const movieIdSchema = positiveIntegerString;

const movieUrlSchema = z.httpUrl().nullable().optional();

const movieCharacterSchema = z.strictObject({
  characterName: z.string().trim().min(1).max(255),
  characterPhotoUrl: movieUrlSchema,
});

export const createMovieSchema = z.strictObject({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1).max(5000),
  releaseDate: z.iso.date().nullable().optional(),
  runtimeMinutes: z.int32().positive().nullable().optional(),
  originalLanguage: z
    .string()
    .trim()
    .min(2)
    .max(10)
    .nullable()
    .optional(),
  rating: z.number().min(0).max(10).nullable().optional(),
  posterUrl: movieUrlSchema,
  trailerUrl: movieUrlSchema,
  genres: z
    .array(z.string().trim().min(1).max(100))
    .max(20)
    .default([]),
  characters: z
    .array(movieCharacterSchema)
    .max(50)
    .default([]),
});

export type MoviesQuery = z.infer<typeof moviesQuerySchema>;

export type RecommendationsQuery = z.infer<
  typeof recommendationsQuerySchema
>;

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
