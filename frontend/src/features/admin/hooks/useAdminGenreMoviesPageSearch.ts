import { useCallback, useState } from "react";
import { getRouteApi } from "@tanstack/react-router";

import { useGenrePreferences } from "../../genres/hooks/useGenrePreferences";
import { useGenres } from "../../genres/hooks/useGenres";
import { useMovieSearch } from "../../movies/hooks/useMovieSearch";
import type { MovieSearchUpdates } from "../../movies/hooks/useMovieSearch";

interface AdminGenreMoviesSearchUpdates extends MovieSearchUpdates {
  genreIds?: number[];
}

const adminRoute = getRouteApi("/_admin/admin/");

export function useAdminGenreMoviesPageSearch() {
  const { search, page, genreIds } = adminRoute.useSearch();
  const navigate = adminRoute.useNavigate();

  const [showGenrePicker, setShowGenrePicker] = useState(false);

  const preferences = useGenrePreferences();
  const genresQuery = useGenres();

  const updateSearch = useCallback(
    (updates: AdminGenreMoviesSearchUpdates, replace = false) =>
      navigate({
        search: (previous) => ({
          ...previous,
          ...updates,
        }),
        replace,
      }),
    [navigate],
  );

  const selectedGenreIds =
    genreIds.length > 0 ? genreIds : preferences.genreIds;

  const movieSearch = useMovieSearch({
    search,
    page,
    updateSearch,
    genreIds: selectedGenreIds,
    enabled: preferences.isReady && selectedGenreIds.length > 0,
  });

  return {
    ...movieSearch,
    genres: genresQuery.data ?? [],
    isGenresLoading: genresQuery.isLoading,
    selectedGenreIds,
    showGenrePicker,
    openGenrePicker: () => setShowGenrePicker(true),
    closeGenrePicker: () => setShowGenrePicker(false),
    userId: preferences.userId,
    savedGenreIds: preferences.genreIds,
    isGenresConfigured: preferences.isConfigured,
    isPreferencesLoading: preferences.isLoading,
    isPreferencesError: preferences.isError,
    updateSearch,
  };
}