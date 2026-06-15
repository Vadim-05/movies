import { useNavigate } from "react-router-dom";

import { useModal } from "@/shared/modal/useModal";
import { SuccessModal } from "@/shared/modal/ui/SuccessModal";

import { MovieForm, useCreateMovie } from "@/features/movie-form";

export default function CreateMoviePage() {
  const navigate = useNavigate();
  const { open } = useModal();

  const createMovie = useCreateMovie({
    onSuccess: () => {
      open(<SuccessModal text="Movie created successfully!" />, {
        onClose: () => navigate("/"),
      });
    },
  });

  return (
    <MovieForm
      mode="create"
      onSubmit={createMovie.mutate}
      isLoading={createMovie.isPending}
    />
  );
}