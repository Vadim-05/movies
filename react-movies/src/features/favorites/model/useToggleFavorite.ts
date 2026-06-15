import { useMutation, useQueryClient } from "@tanstack/react-query";
import { movieApi } from "@/shared/movies/movie.api";

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: movieApi.toggleFavorite,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["movies"],
        exact: false,
      });
    },
  });
};