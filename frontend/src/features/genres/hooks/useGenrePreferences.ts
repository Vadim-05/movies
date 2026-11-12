
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";
import { useUserGenres } from "./useUserGenres";

export function useGenrePreferences() {
  const userQuery = useCurrentUser();
  const userId = userQuery.data?.id;

  const genresQuery = useUserGenres({
    userId: userId ?? 0,
    enabled: userId !== undefined,
  });

  return {
    userId,
    genreIds: genresQuery.data ?? [],
    isLoading:
      userQuery.isPending ||
      (userQuery.isSuccess && genresQuery.isPending),
    isError: userQuery.isError || genresQuery.isError,
    isReady: userQuery.isSuccess && genresQuery.isSuccess,
    isConfigured: (genresQuery.data?.length ?? 0) > 0,
  };
}
