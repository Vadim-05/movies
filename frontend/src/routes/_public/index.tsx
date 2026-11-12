import { useCallback } from "react";
import {
  createFileRoute,
  stripSearchParams,
} from "@tanstack/react-router";
import { CinemaAtmosphere } from "../../components/ui/cinema-atmosphere/CinemaAtmosphere";
import { Oops } from "../../components/ui/oops/Oops";
import { moviesSearchSchema } from "../../features/movies/movies.schema";
import { MovieSearch } from "../../features/movies/components/search/MovieSearch";
import { useMovieSearch } from "../../features/movies/hooks/useMovieSearch";
import type { MovieSearchUpdates } from "../../features/movies/hooks/useMovieSearch";

export const Route = createFileRoute("/_public/")({
  validateSearch: moviesSearchSchema,
  search: {
    middlewares: [
      stripSearchParams({
        search: "",
        page: 1,
      }),
    ],
  },
  component: HomePage,
});

function HomePage() {
  const { search, page } = Route.useSearch();
  const navigate = Route.useNavigate();

  const updateSearch = useCallback(
    (updates: MovieSearchUpdates, replace = false): Promise<void> =>
      navigate({
        search: (previous) => ({
          ...previous,
          ...updates,
        }),
        replace,
      }),
    [navigate],
  );

  const moviesSearch = useMovieSearch({
    search,
    page,
    updateSearch,
  });

  const isEmpty =
    !moviesSearch.isLoading &&
    moviesSearch.pagination?.total === 0 &&
    !search.trim();

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#09090d]">
      <CinemaAtmosphere />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 xl:px-12">
        {isEmpty ? (
          <Oops
            title="No movies yet!"
            message="There are no movies to display right now. Sign in or sign up to create your own movie collection."
          />
        ) : (
          <MovieSearch {...moviesSearch} />
        )}
      </div>
    </main>
  );
}
