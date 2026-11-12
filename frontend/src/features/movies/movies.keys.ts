
import type { MoviesQueryParams } from "./movies.types";

export const moviesKeys = {
  all: ["movies"] as const,

  lists: () => [...moviesKeys.all, "list"] as const,
  list: (params: MoviesQueryParams) =>
    [...moviesKeys.lists(), params] as const,

  details: () => [...moviesKeys.all, "detail"] as const,
  detail: (id: number) =>
    [...moviesKeys.details(), id] as const,

  recommendations: () =>
    [...moviesKeys.all, "recommendations"] as const,

  recommendation: (movieId: number) =>
    [...moviesKeys.recommendations(), movieId] as const,
};
