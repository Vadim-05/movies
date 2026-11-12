
import { useCallback, useEffect } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { useMovieSearchState } from "../../movies/hooks/useMovieSearchState";
import { useFavoriteMovies } from "./useFavoriteMovies";
import type { MovieSearchUpdates } from "../../movies/hooks/useMovieSearchState";
import type { FavoriteMoviesParams } from "../favorites.types";

const favoritesRoute = getRouteApi("/_admin/admin/favorites");

export function useFavoriteMoviesSearch() {
  const { search, page } = favoritesRoute.useSearch();
  const navigate = favoritesRoute.useNavigate();

  const updateSearch = useCallback(
    (updates: MovieSearchUpdates, replace = false): Promise<void> =>
      navigate({
        search: (previous) => ({ ...previous, ...updates }),
        replace,
      }),
    [navigate],
  );

  const searchState = useMovieSearchState({ search, page, updateSearch });

  const query = useFavoriteMovies(
    {
      page: searchState.page,
      pageSize: searchState.pageSize ?? 1,
      search: searchState.search,
    } satisfies FavoriteMoviesParams,
    searchState.isSearchReady,
  );

  const data = searchState.isSearchReady ? query.data : undefined;
  const movies = data?.data ?? [];
  const isLoading = !searchState.isSearchReady || query.isLoading;

  useEffect(() => {
    if (page > 1 && !searchState.search.trim() && !isLoading && !movies.length) {
      void navigate({
        search: (previous) => ({ ...previous, page: 1 }),
        replace: true,
      });
    }
  }, [page, searchState.search, isLoading, movies.length, navigate]);

  const onRetry = useCallback(() => {
    void query.refetch();
  }, [query.refetch]);

  return {
    ...searchState,
    movies,
    pagination: data?.pagination ?? null,
    totalFavorites: data?.pagination.total ?? 0,
    isLoading,
    isError: searchState.isSearchReady && query.isError,
    isFetching: searchState.isSearchReady && query.isFetching,
    isPlaceholderData: searchState.isSearchReady && query.isPlaceholderData,
    onRetry,
  };
}
