import type { FavoriteMoviesParams } from "./favorites.types";

export const favoritesKeys = {
  all: ["favorites"] as const,

  lists: () => [...favoritesKeys.all, "list"] as const,

  list: (params: FavoriteMoviesParams) =>
    [...favoritesKeys.lists(), params] as const,

  toggleMutation: () =>
    [...favoritesKeys.all, "toggle"] as const,
};