import { useState } from "react";
import { Link } from "react-router-dom";

import { SearchInput } from "@/shared/ui/search-input";
import { MovieList } from "@/features/movie-list";
import { useMovies } from "@/features/movie-list/model/useMovies"; 
import type { MoviesResponse } from "@/shared/movies/movie.types";
import { NotFound } from "@/shared/ui/not-found";
import { PageLoader } from "@/shared/ui/page-loader";

type MoviesPage = MoviesResponse;

export default function HomePage() {
  const [search, setSearch] = useState("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useMovies(search);

  const movies =
    data?.pages.flatMap((page: MoviesPage) => page.movies) ?? [];

  if (isLoading) return <PageLoader />;
  if (isError) return <NotFound title="Failed to load movies" />;

  return (
    <div>
      <div className="flex gap-4 mb-6 justify-between">
        <SearchInput value={search} onChange={setSearch} />

        <Link to="/movie/create" className="btn">
          Add Movie
        </Link>
      </div>

      <MovieList movies={movies} />

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="btn mt-6"
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}