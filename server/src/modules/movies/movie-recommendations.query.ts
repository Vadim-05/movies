import { db } from "../../prisma/db.js";
import { MAX_PAGE_SIZE } from "./movies.constants.js";

export interface MovieRecommendationRow {
  id: number;
  title: string;
  posterUrl: string | null;
  releaseDate: string | null;
  originalLanguage: string | null;
  rating: number | null;
  isFavorite: boolean;
}

const movie = db.sql.public.Movie;

const rowSpec = {
  id: movie.columns.id,
  title: movie.columns.title,
  posterUrl: movie.columns.posterUrl,
  releaseDate: movie.columns.releaseDate,
  originalLanguage: movie.columns.originalLanguage,
  rating: movie.columns.rating,
  isFavorite: "pg/bool@1",
} as const;

function isValidPositiveInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value > 0;
}

function createRecommendationsQuery(movieId: number) {
  return db.raw.sql`
    SELECT
      candidate."movieId",
      COUNT(*) AS "sharedGenres"
    FROM "MovieGenre" AS candidate
    INNER JOIN "MovieGenre" AS source
      ON source."genreId" = candidate."genreId"
    WHERE source."movieId" = ${movieId}
      AND candidate."movieId" <> ${movieId}
    GROUP BY candidate."movieId"
  `.returnsRow({
    movieId: movie.columns.id,
    sharedGenres: "pg/int8@1",
  });
}

export async function findMovieRecommendations(
  movieId: number,
  limit: number,
  userId?: number,
): Promise<MovieRecommendationRow[]> {
  if (
    !isValidPositiveInteger(movieId) ||
    !isValidPositiveInteger(limit) ||
    (userId !== undefined && !isValidPositiveInteger(userId))
  ) {
    return [];
  }

  const safeLimit = Math.min(limit, MAX_PAGE_SIZE);
  const recommendations = createRecommendationsQuery(movieId);

  const plan =
    userId === undefined
      ? db.raw.sql`
          WITH recommendations AS (${recommendations})
          SELECT
            m.id,
            m.title,
            m."posterUrl",
            m."releaseDate",
            m."originalLanguage",
            m.rating,
            FALSE AS "isFavorite"
          FROM recommendations
          INNER JOIN "Movie" AS m
            ON m.id = recommendations."movieId"
          ORDER BY
            recommendations."sharedGenres" DESC,
            m.rating DESC NULLS LAST,
            m.id ASC
          LIMIT ${safeLimit}
        `
          .returnsRow(rowSpec)
          .build()
      : db.raw.sql`
          WITH recommendations AS (${recommendations})
          SELECT
            m.id,
            m.title,
            m."posterUrl",
            m."releaseDate",
            m."originalLanguage",
            m.rating,
            EXISTS (
              SELECT 1
              FROM "FavoriteMovie" AS f
              WHERE f."movieId" = m.id
                AND f."userId" = ${userId}
            ) AS "isFavorite"
          FROM recommendations
          INNER JOIN "Movie" AS m
            ON m.id = recommendations."movieId"
          ORDER BY
            recommendations."sharedGenres" DESC,
            m.rating DESC NULLS LAST,
            m.id ASC
          LIMIT ${safeLimit}
        `
          .returnsRow(rowSpec)
          .build();

  return db.query(plan);
}
