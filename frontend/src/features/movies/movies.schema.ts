import { z } from "zod";
import { MAX_SEARCH_LENGTH } from "./movies.constants";

const emptyToNull = z
  .string()
  .trim()
  .transform((value) => value || null);

const optionalNumber = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : Number(value)))
  .pipe(z.number().finite().nullable());

const optionalUrl = emptyToNull.pipe(z.httpUrl().nullable());

const optionalDate = emptyToNull.pipe(z.iso.date().nullable());

const characterSchema = z.strictObject({
  characterName: z
    .string()
    .trim()
    .min(1, "Enter character name.")
    .max(255),

  characterPhotoUrl: optionalUrl,
});

export const createMovieSchema = z.strictObject({
  title: z.string().trim().min(1, "Enter movie title.").max(255),

  description: z
    .string()
    .trim()
    .min(1, "Enter movie description.")
    .max(5000),

  releaseDate: optionalDate,

  runtimeMinutes: optionalNumber.pipe(
    z.number().int().positive().nullable(),
  ),

  originalLanguage: emptyToNull.pipe(
    z.string().min(2).max(10).nullable(),
  ),

  rating: optionalNumber.pipe(
    z.number().min(0).max(10).nullable(),
  ),

  posterUrl: optionalUrl,
  trailerUrl: optionalUrl,

  genres: z
    .string()
    .transform((value) => [
      ...new Set(
        value
          .split(",")
          .map((genre) => genre.normalize("NFKC").trim())
          .filter(Boolean),
      ),
    ])
    .pipe(z.array(z.string().min(1).max(100)).max(20)),

  characters: z.array(characterSchema).max(50),
});

export const moviesSearchSchema = z.object({
  search: z
    .string()
    .trim()
    .max(MAX_SEARCH_LENGTH)
    .catch(""),

  page: z.number().int().positive().catch(1),
});

export type CreateMovieFormInput = z.input<typeof createMovieSchema>;
export type CreateMoviePayload = z.output<typeof createMovieSchema>;
export type MoviesSearchParams = z.infer<typeof moviesSearchSchema>;