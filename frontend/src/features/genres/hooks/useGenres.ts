import { useQuery } from "@tanstack/react-query";
import { getGenres } from "../api/genres.api";
import { genresKeys } from "../genres.keys";

const GENRES_STALE_TIME = 5 * 60 * 1000;

interface UseGenresOptions {
  enabled?: boolean;
}

export function useGenres({ enabled = true }: UseGenresOptions = {}) {
  return useQuery({
    queryKey: genresKeys.lists(),
    queryFn: ({ signal }) => getGenres(signal),
    staleTime: GENRES_STALE_TIME,
    enabled,
  });
}