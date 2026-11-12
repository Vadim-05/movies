import { useCallback } from "react";
import {
  useMutation,
  useMutationState,
  useQueryClient,
} from "@tanstack/react-query";
import { favoritesApi } from "../api/favorites.api";
import { favoritesKeys } from "../favorites.keys";
import { moviesKeys } from "../../movies/movies.keys";
import type {
  MovieDetailsResponse,
  MoviesListResponse,
} from "../../movies/movies.types";

interface ToggleFavoriteInput {
  movieId: number;
  shouldBeFavorite: boolean;
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const mutationKey = favoritesKeys.toggleMutation();

  const { mutate } = useMutation({
    mutationKey,

    mutationFn: ({ movieId, shouldBeFavorite }: ToggleFavoriteInput) =>
      shouldBeFavorite
        ? favoritesApi.add(movieId)
        : favoritesApi.remove(movieId),

    onMutate: async ({ movieId, shouldBeFavorite }) => {
      const updateMovie = (old?: MoviesListResponse) =>
        old && {
          ...old,
          data: old.data.map((movie) =>
            movie.id === movieId
              ? { ...movie, isFavorite: shouldBeFavorite }
              : movie,
          ),
        };

      await Promise.all([
        queryClient.cancelQueries({ queryKey: moviesKeys.lists() }),
        queryClient.cancelQueries({ queryKey: moviesKeys.detail(movieId) }),
        queryClient.cancelQueries({
          queryKey: moviesKeys.recommendations(),
        }),
      ]);

      queryClient.setQueriesData(
        { queryKey: moviesKeys.lists() },
        updateMovie,
      );

      queryClient.setQueriesData(
        { queryKey: moviesKeys.recommendations() },
        updateMovie,
      );

      queryClient.setQueryData<MovieDetailsResponse>(
        moviesKeys.detail(movieId),
        (old) =>
          old && {
            ...old,
            data: { ...old.data, isFavorite: shouldBeFavorite },
          },
      );
    },

    onError: (_error, { movieId }) => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: moviesKeys.lists() }),
        queryClient.invalidateQueries({
          queryKey: moviesKeys.detail(movieId),
        }),
        queryClient.invalidateQueries({
          queryKey: moviesKeys.recommendations(),
        }),
      ]);
    },

    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: favoritesKeys.lists() }),
  });

  const pendingIds = useMutationState<number>({
    filters: { mutationKey, status: "pending" },
    select: (mutation) =>
      (mutation.state.variables as ToggleFavoriteInput).movieId,
  });

  const toggleFavorite = useCallback(
    (movieId: number, shouldBeFavorite: boolean) =>
      mutate({ movieId, shouldBeFavorite }),
    [mutate],
  );

  const isPending = useCallback(
    (movieId: number) => pendingIds.includes(movieId),
    [pendingIds],
  );

  return { toggleFavorite, isPending };
}
