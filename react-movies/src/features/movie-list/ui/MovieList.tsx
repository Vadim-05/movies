import type { Movie } from "@/shared/movies/movie.types";
import { MovieCard } from "./MovieCard";
import { EmptyState } from "@/shared/ui/empty-state";

type Props = {
  movies: Movie[];
};

export function MovieList({ movies}: Props) {
  if (movies.length === 0) {
    return (
      <EmptyState message="No movies found" />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </div>
  );
}