import { useCallback } from "react";
import { useMovies } from "./useMovie";
import { useMovieSearchState } from "./useMovieSearchState";
import type { MovieSearchUpdates } from "./useMovieSearchState";
import type { MoviesQueryParams } from "../movies.types";

export type { MovieSearchUpdates } from "./useMovieSearchState";

interface UseMovieSearchOptions {
  search: string;
  page: number;
  updateSearch: (
    updates: MovieSearchUpdates,
    replace?: boolean,
  ) => Promise<void>;
  genreIds?: number[];
  enabled?: boolean;
}

export function useMovieSearch({
  search,
  page,
  updateSearch,
  genreIds,
  enabled = true,
}: UseMovieSearchOptions) {
  const searchState = useMovieSearchState({
    search,
    page,
    updateSearch,
  });

  const isQueryEnabled =
    enabled && searchState.isSearchReady;

  const params: MoviesQueryParams = {
    page: searchState.page,
    pageSize: searchState.pageSize ?? 1,
    search: searchState.search,
    ...(genreIds !== undefined
      ? { genres: genreIds }
      : {}),
  };

  const query = useMovies(params, isQueryEnabled);

  const data = isQueryEnabled ? query.data : undefined;

  const onRetry = useCallback(() => {
    void query.refetch();
  }, [query.refetch]);

  return {
    ...searchState,

    movies: data?.data ?? [],
    pagination: data?.pagination ?? null,

    isLoading: enabled && (!isQueryEnabled || query.isLoading),
    isError: isQueryEnabled && query.isError,
    isFetching: isQueryEnabled && query.isFetching,
    isPlaceholderData: isQueryEnabled && query.isPlaceholderData,

    onRetry,
  };
}