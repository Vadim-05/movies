
import type { MoviesListResponse } from "../movies/movies.types";

export interface FavoriteMoviesParams {
  page: number;
  pageSize: number;
  search?: string;
}

export type FavoriteMoviesResponse = MoviesListResponse;
