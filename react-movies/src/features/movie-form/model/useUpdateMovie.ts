import { useMutation, useQueryClient } from "@tanstack/react-query";
import { movieApi } from "@/shared/movies/movie.api";
import type { MovieFormValues } from "@/features/movie-form/model/movie.schema";

type Params = {
  id: string;
  onSuccess?: () => void;
};

export function useUpdateMovie({ id, onSuccess }: Params) {
  const queryClient = useQueryClient();

  const numericId = Number(id);

  return useMutation({
    mutationFn: (data: MovieFormValues) =>
      movieApi.updateMovie(numericId, data),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["movies"] }),
        queryClient.invalidateQueries({ queryKey: ["movie", numericId] }),
      ]);

      onSuccess?.();
    },
  });
}