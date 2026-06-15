import { useParams, useNavigate } from "react-router-dom";
import { useModal } from "@/shared/modal/useModal";
import { SuccessModal } from "@/shared/modal/ui/SuccessModal";

import { MovieForm, useUpdateMovie } from "@/features/movie-form";
import { useMovieDetails } from "@/features/movie-details/model/useMovieDetails";

import { PageLoader } from "@/shared/ui/page-loader";
import { NotFound } from "@/shared/ui/not-found";

export default function EditMoviePage() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const { open } = useModal();

  if (!id) return <NotFound title="Invalid movie id" />;

  const { data: movie, isLoading } = useMovieDetails(id);

  const updateMovie = useUpdateMovie({
    id,
    onSuccess: () => {
      open(<SuccessModal text="Movie updated successfully!" />, {
        onClose: () => navigate("/"),
      });
    },
  });

  if (isLoading) return <PageLoader />;
  if (!movie) return <NotFound title="Movie not found" />;

  return (
    <MovieForm
      mode="edit"
      initialValues={movie}
      onSubmit={updateMovie.mutate}
      isLoading={updateMovie.isPending}
    />
  );
}