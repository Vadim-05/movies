import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { favoritesApi } from "../api/favorites.api";
import { favoritesKeys } from "../favorites.keys";
import type {
  FavoriteMoviesParams,
  FavoriteMoviesResponse,
} from "../favorites.types";

export function useFavoriteMovies(
  params: FavoriteMoviesParams,
  enabled = true,
) {
  const normalizedParams: FavoriteMoviesParams = {
    ...params,
    search: params.search?.trim() || undefined,
  };

  const isValidParams =
    Number.isSafeInteger(normalizedParams.page) &&
    normalizedParams.page > 0 &&
    Number.isSafeInteger(normalizedParams.pageSize) &&
    normalizedParams.pageSize > 0;

  return useQuery<FavoriteMoviesResponse, Error>({
    queryKey: favoritesKeys.list(normalizedParams),

    queryFn: async ({ signal }) => {
      const { data } = await favoritesApi.getAll(
        normalizedParams,
        signal,
      );

      return data;
    },

    enabled: enabled && isValidParams,
    placeholderData: keepPreviousData,
  });
}
