import { createFileRoute } from "@tanstack/react-router";
import { AsyncState } from "../../../../components/ui/async-state/AsyncState";
import { MovieDetailsContent } from "../../../../features/movies/components/details/MovieDetailsContent";
import { useMovie } from "../../../../features/movies/hooks/useMovie";

export const Route = createFileRoute("/_admin/admin/movies/$id")({
  component: MovieDetailsPage,
});

function MovieDetailsPage() {
  const { id } = Route.useParams();
  const navigate = Route.useNavigate();

  const movieId = Number(id);
  const isValidId = Number.isSafeInteger(movieId) && movieId > 0;

  const { data, isPending, isError } = useMovie(
    movieId,
    isValidId,
  );

  if (!isValidId) {
    return (
      <AsyncState
        type="error"
        message="Invalid movie ID."
      />
    );
  }

  if (isPending) {
    return (
      <AsyncState
        type="loading"
        message="Loading movie..."
      />
    );
  }

  if (isError || !data?.data) {
    return (
      <AsyncState
        type="error"
        message="Movie not found."
        action={{
          label: "View All Movies",
          onClick: () => {
            void navigate({
              to: "/admin/all-movies",
              search: {
                search: "",
                page: 1,
                genreIds: [],
              },
            });
          },
        }}
      />
    );
  }

  return <MovieDetailsContent movie={data.data} isAdmin />;
}
