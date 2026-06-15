import { useDeleteMovie } from "@/features/movie-delete/model/useDeleteMovie";
import { useModal } from "@/shared/modal";
import { useNavigate } from "react-router-dom";
type Props = {
  movieId: number;
};

export function DeleteMovieModal({ movieId }: Props) {
  const { closeTop } = useModal();
  const navigate = useNavigate();
  
  const { mutate, isPending } = useDeleteMovie();

  const handleDelete = () => {
    mutate(
      { movieId },
      {
        onSuccess: () => {
          closeTop();
          navigate("/");
        },
      }
    );
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">
        Delete movie
      </h2>

      <p className="text-neutral-400">
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        <button
          className="btn"
          onClick={closeTop}
          disabled={isPending}
        >
          Cancel
        </button>

        <button
          className="btn bg-red-600 hover:bg-red-700"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}