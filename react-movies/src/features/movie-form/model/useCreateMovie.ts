import { useMutation, useQueryClient } from "@tanstack/react-query";
import { movieApi } from "@/shared/movies/movie.api";
import type { MovieFormValues } from "@/features/movie-form/model/movie.schema";

type Params = {
  onSuccess?: () => void;
};

export function useCreateMovie({ onSuccess }: Params = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MovieFormValues) =>
      movieApi.createMovie(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["movies"] });

      onSuccess?.();
    },
  });
}