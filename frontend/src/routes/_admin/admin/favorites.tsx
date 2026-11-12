
import {
  createFileRoute,
  stripSearchParams,
} from "@tanstack/react-router";
import { Oops } from "../../../components/ui/oops/Oops";
import { adminSearchSchema } from "../../../features/admin/admin.schemas";
import { useFavoriteMoviesSearch } from "../../../features/favorites/hooks/useFavoriteMoviesSearch";
import { MovieSearch } from "../../../features/movies/components/search/MovieSearch";

export const Route = createFileRoute("/_admin/admin/favorites")({
  validateSearch: adminSearchSchema,
  search: {
    middlewares: [
      stripSearchParams({
        search: "",
        page: 1,
      }),
    ],
  },
  component: AdminFavoritesPage,
});

function AdminFavoritesPage() {
  const movieSearch = useFavoriteMoviesSearch();
  const { search } = Route.useSearch();

  const isEmpty =
    !movieSearch.isLoading &&
    movieSearch.totalFavorites === 0 &&
    !search.trim();

  return (
    <main className="space-y-6">
      {isEmpty ? (
        <Oops
          title="No favorite movies yet!"
          message="Add movies to your favorites to see them here."
        />
      ) : (
        <MovieSearch {...movieSearch} />
      )}
    </main>
  );
}
