import { apiClient } from "@/shared/api/httpClient";
import { endpoints } from "@/shared/api/endpoints";
import { parse } from "@/shared/api/parse";

import { movieSchema, moviesSchema } from "@/shared/movies/movie.schema";

import type {
  Movie,
  MoviesResponse,
  ApiResponse,
} from "@/shared/movies/movie.types";

import type { MovieFormValues } from "@/features/movie-form/model/movie.schema";

import { toMovieFormData } from "@/shared/movies/movie.mapper";

const parseMovie = (data: unknown): Movie =>
  parse(movieSchema, data);

const parseMovies = (res: ApiResponse<Movie[]>): MoviesResponse => {
  const normalized = moviesSchema.parse({
    data: res.data,
    nextCursor: res.meta?.nextCursor ?? null,
  });

  return {
    movies: normalized.data,
    nextCursor: normalized.nextCursor,
  };
};

export const movieApi = {
  async getMovies(params: { search?: string; limit: number; cursor?: number | null;}): Promise<MoviesResponse> {
    const res = await apiClient.get<ApiResponse<Movie[]>>(
      endpoints.movies,
      { params }
    );

    return parseMovies(res);
  },

  async getMovieById(id: string | number): Promise<Movie> {
    const res = await apiClient.get<ApiResponse<Movie>>(
      endpoints.movie(id)
    );

    return parseMovie(res.data);
  },

  async createMovie(payload: MovieFormValues): Promise<Movie> {
    const res = await apiClient.post<ApiResponse<Movie>, FormData>(
      endpoints.movies,
      toMovieFormData(payload)
    );

    return parseMovie(res.data);
  },

  async updateMovie( id: string | number, payload: MovieFormValues): Promise<Movie> {
    const res = await apiClient.put<ApiResponse<Movie>, FormData>(
      endpoints.movie(id),
      toMovieFormData(payload)
    );

    return parseMovie(res.data);
  },

  async deleteMovie(id: string | number): Promise<void> {
    await apiClient.delete(endpoints.movie(id));
  },

  async toggleFavorite(id: string | number): Promise<Movie> {
    const res = await apiClient.patch<ApiResponse<Movie>>(
      endpoints.favorite(id)
    );

    return parseMovie(res.data);
  },
};