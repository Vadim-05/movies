
import { memo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

import { authKeys } from "../../auth/auth.keys";
import type { AuthUser } from "../../auth/auth.types";
import { useToggleFavorite } from "../hooks/useToggleFavorite";

interface FavoriteButtonProps {
  movieId: number;
  isFavorite: boolean;
  className?: string;
}

export const FavoriteButton = memo(function FavoriteButton({
  movieId,
  isFavorite,
  className,
}: FavoriteButtonProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { toggleFavorite, isPending } = useToggleFavorite();

  const isFavoritePending = isPending(movieId);

  function handleClick() {
    if (isFavoritePending) return;

    const user = queryClient.getQueryData<AuthUser | null>(
      authKeys.currentUser(),
    );

    if (!user) {
      void navigate({ to: "/login" });
      return;
    }

    toggleFavorite(movieId, !isFavorite);
  }

  return (
    <button
      type="button"
      disabled={isFavoritePending}
      onClick={handleClick}
      aria-label={
        isFavorite ? "Remove from Favorites" : "Add to Favorites"
      }
      aria-pressed={isFavorite}
      aria-busy={isFavoritePending}
      className={[
        "inline-flex size-10 items-center justify-center rounded-full",
        "border border-white/10 bg-black/50 text-white backdrop-blur-md",
        "transition-all duration-200",
        "hover:scale-110 hover:border-red-400/50 hover:bg-red-500/15",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
        "disabled:cursor-not-allowed disabled:opacity-60",
        isFavorite ? "text-red-500" : "",
        className ?? "",
      ].filter(Boolean).join(" ")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
      </svg>
    </button>
  );
});
