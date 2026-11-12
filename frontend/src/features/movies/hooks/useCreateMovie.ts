import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMovie } from "../api/movies.api";
import { moviesKeys } from "../movies.keys";

export function useCreateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMovie,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: moviesKeys.lists(),
      });
    },
  });
}
