import { api } from "../../../lib/api";
import type {
  FavoriteMoviesParams,
  FavoriteMoviesResponse,
} from "../favorites.types";

function validateMovieId(movieId: number): void {
  if (!Number.isSafeInteger(movieId) || movieId < 1) {
    throw new Error("Invalid movie ID.");
  }
}

export const favoritesApi = {
  getAll(params: FavoriteMoviesParams, signal?: AbortSignal) {
    return api.get<FavoriteMoviesResponse>("/movies/favorites", {
      params,
      signal,
    });
  },

  add(movieId: number) {
    validateMovieId(movieId);

    return api.post<void>(`/movies/${movieId}/favorite`);
  },

  remove(movieId: number) {
    validateMovieId(movieId);

    return api.delete<void>(`/movies/${movieId}/favorite`);
  },
};
