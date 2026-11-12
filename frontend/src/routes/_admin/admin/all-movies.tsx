
import { useCallback } from "react";
import {
  createFileRoute,
  stripSearchParams,
} from "@tanstack/react-router";
import { Oops } from "../../../components/ui/oops/Oops";
import { adminMoviesSearchSchema } from "../../../features/admin/admin.schemas";
import { MovieSearch } from "../../../features/movies/components/search/MovieSearch";
import { useMovieSearch } from "../../../features/movies/hooks/useMovieSearch";
import type { MovieSearchUpdates } from "../../../features/movies/hooks/useMovieSearch";

export const Route = createFileRoute("/_admin/admin/all-movies")({
  validateSearch: adminMoviesSearchSchema,
  search: {
    middlewares: [
      stripSearchParams({
        search: "",
        page: 1,
        genreIds: [],
      }),
    ],
  },
  component: AdminMoviesPage,
});

function AdminMoviesPage() {
  const { search, page } = Route.useSearch();
  const navigate = Route.useNavigate();

  const updateSearch = useCallback(
    (updates: MovieSearchUpdates, replace = false) =>
      navigate({
        search: (previous) => ({
          ...previous,
          ...updates,
        }),
        replace,
      }),
    [navigate],
  );

  const movieSearch = useMovieSearch({
    search,
    page,
    updateSearch,
  });

  const isEmpty =
    !movieSearch.isLoading &&
    movieSearch.pagination?.total === 0 &&
    !search.trim();

  return (
    <main className="space-y-6">
      {isEmpty ? (
        <Oops
          title="No movies yet!"
          message="Your movie library is empty. Create your first movie."
        />
      ) : (
        <MovieSearch {...movieSearch} />
      )}
    </main>
  );
}
