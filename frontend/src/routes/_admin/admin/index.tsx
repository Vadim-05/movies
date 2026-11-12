import {
  createFileRoute,
  stripSearchParams,
} from "@tanstack/react-router";
import { AsyncState } from "../../../components/ui/async-state/AsyncState";
import { Oops } from "../../../components/ui/oops/Oops";
import { adminMoviesSearchSchema } from "../../../features/admin/admin.schemas";
import { useAdminGenreMoviesPageSearch } from "../../../features/admin/hooks/useAdminGenreMoviesPageSearch";
import { GenrePicker } from "../../../features/genres/components/GenrePicker";
import { MovieSearch } from "../../../features/movies/components/search/MovieSearch";

export const Route = createFileRoute("/_admin/admin/")({
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
  component: AdminDashboard,
});

function AdminDashboard() {
  const dashboard = useAdminGenreMoviesPageSearch();

  if (dashboard.isPreferencesLoading) {
    return <AsyncState type="loading" message="Loading..." />;
  }

  if (
    dashboard.isPreferencesError ||
    dashboard.userId === undefined
  ) {
    return (
      <AsyncState
        type="error"
        message="Failed to load profile or saved genres."
      />
    );
  }

  return (
    <main className="space-y-6">
      {dashboard.genres.length > 0 && (
        <GenrePicker
          userId={dashboard.userId}
          savedGenreIds={dashboard.savedGenreIds}
          isGenresConfigured={dashboard.isGenresConfigured}
          showGenrePicker={dashboard.showGenrePicker}
          openGenrePicker={dashboard.openGenrePicker}
          closeGenrePicker={dashboard.closeGenrePicker}
          updateSearch={dashboard.updateSearch}
        />
      )}
      {dashboard.selectedGenreIds.length === 0 ? (
        <Oops
          title="Select genres!"
          message="Create a movie with a genre."
        />
      ) : (
        <MovieSearch {...dashboard} />
      )}
    </main>
  );
}