import type { CollectionRowOf } from "@prisma/orm-postgres/orm-client";
import { db } from "../../prisma/db.js";
import type {
  MovieDetails,
  MovieListItem,
  MovieListResult,
  MoviesRepository,
} from "./movies.repository.js";
import type {
  CreateMovieInput,
  MoviesQuery,
} from "./movies.schemas.js";
import { findMovieRecommendations } from "./movie-recommendations.query.js";

const movieDetailsFragment = db.orm.public.Movie.fragment((movie) =>
  movie
    .select(
      "id",
      "title",
      "posterUrl",
      "releaseDate",
      "originalLanguage",
      "rating",
      "description",
      "runtimeMinutes",
      "trailerUrl",
      "createdAt",
      "updatedAt",
    )
    .include("genres", (item) =>
      item
        .select("genreId")
        .include("genre", (genre) => genre.select("id", "name"))
        .orderBy((item) => item.genreId.asc()),
    )
    .include("characters", (character) =>
      character
        .select(
          "id",
          "characterName",
          "characterPhotoUrl",
          "castOrder",
        )
        .orderBy((character) => character.castOrder.asc()),
    ),
);

type MovieDetailsProjection = CollectionRowOf<
  ReturnType<typeof movieDetailsFragment>
>;

function normalizeGenreName(name: string): string {
  return name.normalize("NFKC").trim().toLowerCase();
}

function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

function toMovieListItem(
  movie: {
    id: number;
    title: string;
    posterUrl: string | null;
    releaseDate: string | null;
    originalLanguage: string | null;
    rating: number | null;
  },
  isFavorite = false,
): MovieListItem {
  return {
    id: movie.id,
    title: movie.title,
    posterUrl: movie.posterUrl,
    releaseDate: movie.releaseDate,
    originalLanguage: movie.originalLanguage,
    rating: movie.rating,
    isFavorite,
  };
}

function toMovieDetails(
  movie: MovieDetailsProjection,
  isFavorite = false,
): MovieDetails {
  return {
    ...toMovieListItem(movie, isFavorite),
    description: movie.description,
    runtimeMinutes: movie.runtimeMinutes,
    trailerUrl: movie.trailerUrl,
    createdAt: movie.createdAt,
    updatedAt: movie.updatedAt,
    genres: movie.genres.flatMap(({ genre }) =>
      genre ? [{ id: genre.id, name: genre.name }] : [],
    ),
    characters: movie.characters,
  };
}

export class DatabaseMoviesRepository implements MoviesRepository {
  async create(input: CreateMovieInput): Promise<MovieDetails> {
    return db.transaction(async (tx) => {
      const movie = await tx.orm.public.Movie.create({
        title: input.title,
        description: input.description,
        releaseDate: input.releaseDate ?? null,
        runtimeMinutes: input.runtimeMinutes ?? null,
        originalLanguage: input.originalLanguage ?? null,
        rating: input.rating ?? null,
        posterUrl: input.posterUrl ?? null,
        trailerUrl: input.trailerUrl ?? null,
      });

      const genres = new Map(
        input.genres.map((name) => {
          const normalizedName = normalizeGenreName(name);

          return [
            normalizedName,
            name.normalize("NFKC").trim(),
          ] as const;
        }),
      );

      if (genres.size > 0) {
        const createdGenres = await Promise.all(
          [...genres].map(([normalizedName, name]) =>
            tx.orm.public.Genre.upsert({
              create: { name, normalizedName },
              update: {},
              conflictOn: { normalizedName },
            }),
          ),
        );

        await tx.orm.public.MovieGenre.createAll(
          createdGenres.map(({ id }) => ({
            movieId: movie.id,
            genreId: id,
          })),
        );
      }

      if (input.characters.length > 0) {
        await tx.orm.public.MovieCharacter.createAll(
          input.characters.map((character, castOrder) => ({
            movieId: movie.id,
            characterName: character.characterName,
            characterPhotoUrl:
              character.characterPhotoUrl ?? null,
            castOrder,
          })),
        );
      }

      const result = await tx.orm.public.Movie
        .where({ id: movie.id })
        .with(movieDetailsFragment)
        .first();

      if (!result) {
        throw new Error("Created movie could not be retrieved.");
      }

      return toMovieDetails(result);
    });
  }

  async findMany(
    query: MoviesQuery,
    userId?: number,
  ): Promise<MovieListResult> {
    const { page, pageSize, search, genres } = query;
    const offset = (page - 1) * pageSize;

    const movies = db.orm.public.Movie;

    const searchedMovies = search
      ? movies.where((movie) =>
          movie.title.ilike(
            `%${escapeLikePattern(search)}%`,
          ),
        )
      : movies;

    const filteredMovies = genres.length > 0
      ? searchedMovies.where((movie) =>
          movie.genres.some((movieGenre) =>
            movieGenre.genreId.in(genres),
          ),
        )
      : searchedMovies;

    const totalPromise = filteredMovies.aggregate((aggregate) => ({
      count: aggregate.count(),
    }));

    if (userId === undefined) {
      const [items, total] = await Promise.all([
        filteredMovies
          .select(
            "id",
            "title",
            "posterUrl",
            "releaseDate",
            "originalLanguage",
            "rating",
          )
          .orderBy((movie) => movie.id.asc())
          .offset(offset)
          .limit(pageSize)
          .all(),
        totalPromise,
      ]);

      return {
        items: items.map((movie) => toMovieListItem(movie)),
        total: total.count,
      };
    }

    const [items, total] = await Promise.all([
      filteredMovies
        .select(
          "id",
          "title",
          "posterUrl",
          "releaseDate",
          "originalLanguage",
          "rating",
        )
        .include("favorites", (favorite) =>
          favorite.where({ userId }).count(),
        )
        .orderBy((movie) => movie.id.asc())
        .offset(offset)
        .limit(pageSize)
        .all(),
      totalPromise,
    ]);

    return {
      items: items.map((movie) =>
        toMovieListItem(movie, movie.favorites > 0),
      ),
      total: total.count,
    };
  }

  async findFavoriteMany(
    query: MoviesQuery,
    userId: number,
  ): Promise<MovieListResult> {
    const { page, pageSize, search, genres } = query;
    const offset = (page - 1) * pageSize;

    const favorites = db.orm.public.Movie.where((movie) =>
      movie.favorites.some((favorite) =>
        favorite.userId.eq(userId),
      ),
    );

    const searchedMovies = search
      ? favorites.where((movie) =>
          movie.title.ilike(
            `%${escapeLikePattern(search)}%`,
          ),
        )
      : favorites;

    const filteredMovies = genres.length > 0
      ? searchedMovies.where((movie) =>
          movie.genres.some((movieGenre) =>
            movieGenre.genreId.in(genres),
          ),
        )
      : searchedMovies;

    const [items, total] = await Promise.all([
      filteredMovies
        .select(
          "id",
          "title",
          "posterUrl",
          "releaseDate",
          "originalLanguage",
          "rating",
        )
        .orderBy((movie) => movie.id.asc())
        .offset(offset)
        .limit(pageSize)
        .all(),
      filteredMovies.aggregate((aggregate) => ({
        count: aggregate.count(),
      })),
    ]);

    return {
      items: items.map((movie) => toMovieListItem(movie, true)),
      total: total.count,
    };
  }

  async findById(
    id: number,
    userId?: number,
  ): Promise<MovieDetails | null> {
    const query = db.orm.public.Movie
      .where({ id })
      .with(movieDetailsFragment);

    if (userId === undefined) {
      const movie = await query.first();

      return movie ? toMovieDetails(movie) : null;
    }

    const movie = await query
      .include("favorites", (favorite) =>
        favorite.where({ userId }).count(),
      )
      .first();

    return movie
      ? toMovieDetails(movie, movie.favorites > 0)
      : null;
  }

  findRecommendations(
    movieId: number,
    limit: number,
    userId?: number,
  ): Promise<MovieListItem[]> {
    return findMovieRecommendations(movieId, limit, userId);
  }

  async addFavorite(
    movieId: number,
    userId: number,
  ): Promise<boolean> {
    const movie = await db.orm.public.Movie
      .where({ id: movieId })
      .first();

    if (!movie) {
      return false;
    }

    await db.orm.public.FavoriteMovie.upsert({
      create: { movieId, userId },
      update: {},
      conflictOn: { userId, movieId },
    });

    return true;
  }

  async removeFavorite(
    movieId: number,
    userId: number,
  ): Promise<void> {
    await db.orm.public.FavoriteMovie
      .where({ movieId, userId })
      .delete();
  }
}
