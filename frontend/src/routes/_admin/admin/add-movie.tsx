import { createFileRoute } from "@tanstack/react-router";
import { FeedbackModal } from "../../../components/ui/feedback-modal/FeedbackModal";
import { MovieForm } from "../../../features/movies/components/MovieForm";
import { useCreateMovie } from "../../../features/movies/hooks/useCreateMovie";

export const Route = createFileRoute("/_admin/admin/add-movie")({
  component: AddMoviePage,
});

function AddMoviePage() {
  const navigate = Route.useNavigate();
  const createMovie = useCreateMovie();

  const isSuccess = createMovie.isSuccess;
  const isError = createMovie.isError;

  function handleClose() {
    createMovie.reset();

    if (isSuccess) {
      void navigate({
        to: "/admin/all-movies",
        search: {
          search: "",
          page: 1,
          genreIds: [],
        },
      });
    }
  }

  function handleRetry() {
    if (createMovie.variables && !createMovie.isPending) {
      createMovie.mutate(createMovie.variables);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <MovieForm
        onSubmit={createMovie.mutate}
        isPending={createMovie.isPending}
      />

      <FeedbackModal
        open={isSuccess || isError}
        status={isError ? "error" : "success"}
        title={
          isError
            ? "An error occurred."
            : "Movie created successfully!"
        }
        message={
          isError
            ? "Failed to create movie. Please try again."
            : "New movie successfully added to the collection."
        }
        onClose={handleClose}
        onRetry={handleRetry}
      />
    </main>
  );
}
