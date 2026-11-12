import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getMovieById,
  getMovies,
  getMovieRecommendations,
} from "../api/movies.api";
import { moviesKeys } from "../movies.keys";
import type { MoviesQueryParams } from "../movies.types";

export function useMovie(id: number, enabled = true) {
  const isValidId = Number.isSafeInteger(id) && id > 0;

  return useQuery({
    queryKey: moviesKeys.detail(id),
    queryFn: ({ signal }) => getMovieById(id, signal),
    enabled: enabled && isValidId,
  });
}

export function useMovies(
  params: MoviesQueryParams,
  enabled = true,
) {
  const normalizedParams: MoviesQueryParams = {
    ...params,
    search: params.search?.trim() || undefined,
    genres: params.genres?.length
      ? [...new Set(params.genres)].sort((a, b) => a - b)
      : undefined,
  };

  return useQuery({
    queryKey: moviesKeys.list(normalizedParams),
    queryFn: ({ signal }) => getMovies(normalizedParams, signal),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useMovieRecommendations(
  movieId: number,
  enabled = true,
) {
  const isValidId =
    Number.isSafeInteger(movieId) && movieId > 0;

  return useQuery({
    queryKey: moviesKeys.recommendation(movieId),
    queryFn: ({ signal }) =>
      getMovieRecommendations(movieId, signal),
    enabled: enabled && isValidId,
  });
}
