import { useToggleFavorite } from "@/features/favorites/model/useToggleFavorite";

type Props = {
  movieId: number;
  isFavorite: boolean;
};

export function FavoriteButton({ movieId, isFavorite}: Props) {
  const { mutate, isPending } =
    useToggleFavorite();

  return (
    <button
      className="mx-auto flex items-center"
      onClick={() => mutate(movieId)}
      disabled={isPending}
    >
      {isFavorite ? "💖" : "🤍"}
    </button>
  );
}
