import type {
  CreateMovieInput,
  MoviesQuery,
} from "./movies.schemas.js";

export interface MovieGenreItem {
  id: number;
  name: string;
}

export interface MovieCharacterItem {
  id: number;
  characterName: string;
  characterPhotoUrl: string | null;
  castOrder: number;
}

export interface MovieListItem {
  id: number;
  title: string;
  posterUrl: string | null;
  releaseDate: string | null;
  originalLanguage: string | null;
  rating: number | null;
  isFavorite: boolean;
}

export interface MovieDetails extends MovieListItem {
  description: string;
  runtimeMinutes: number | null;
  trailerUrl: string | null;
  createdAt: string;
  updatedAt: string;
  genres: MovieGenreItem[];
  characters: MovieCharacterItem[];
}

export interface MovieListResult {
  items: MovieListItem[];
  total: number;
}

export interface MoviesRepository {
  create(input: CreateMovieInput): Promise<MovieDetails>;

  findMany(
    query: MoviesQuery,
    userId?: number,
  ): Promise<MovieListResult>;

  findFavoriteMany(
    query: MoviesQuery,
    userId: number,
  ): Promise<MovieListResult>;

  findById(
    id: number,
    userId?: number,
  ): Promise<MovieDetails | null>;

  findRecommendations(
    movieId: number,
    limit: number,
    userId?: number,
  ): Promise<MovieListItem[]>;

  addFavorite(
    movieId: number,
    userId: number,
  ): Promise<boolean>;

  removeFavorite(
    movieId: number,
    userId: number,
  ): Promise<void>;
}
