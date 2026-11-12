import { useQuery } from "@tanstack/react-query";
import { getUserGenres } from "../api/genres.api";
import { genresKeys } from "../genres.keys";

const USER_GENRES_STALE_TIME = 5 * 60 * 1000;

interface UseUserGenresOptions {
  userId: number;
  enabled?: boolean;
}

export function useUserGenres({
  userId,
  enabled = true,
}: UseUserGenresOptions) {
  return useQuery({
    queryKey: genresKeys.user(userId),
    queryFn: ({ signal }) => getUserGenres(signal),
    enabled: enabled && Number.isSafeInteger(userId) && userId > 0,
    staleTime: USER_GENRES_STALE_TIME,
    retry: 1,
  });
}