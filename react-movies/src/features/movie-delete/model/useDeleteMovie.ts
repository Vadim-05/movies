import { useMutation, useQueryClient } from "@tanstack/react-query";
import { movieApi } from "@/shared/movies/movie.api";

type DeleteMovieParams = {
  movieId: number;
  onSuccess?: () => void;
};

export function useDeleteMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ movieId }: DeleteMovieParams) =>
      movieApi.deleteMovie(movieId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["movies"],
      });

      variables.onSuccess?.();
    },
  });
}