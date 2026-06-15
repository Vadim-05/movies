import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/shared/movies/movie.api";

export function useMovieDetails(id: string) {
  const numericId = Number(id);

  return useQuery({
    queryKey: ["movie", numericId],
    queryFn: () => movieApi.getMovieById(numericId),
    enabled: !isNaN(numericId) && numericId > 0,
  });
}