import { useModal } from "@/shared/modal";
import { DeleteMovieModal } from "@/features/movie-delete/ui/DeleteMovieModal";

type Props = {
  movieId: number;
};

export function DeleteMovieButton({ movieId }: Props) {
  const { open } = useModal();

  return (
    <button
      className="btn bg-red-600 hover:bg-red-700"
      onClick={() =>
        open(<DeleteMovieModal movieId={movieId} />)
      }
    >
      Delete
    </button>
  );
}