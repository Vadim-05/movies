import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replaceUserGenres } from "../api/genres.api";
import { genresKeys } from "../genres.keys";

interface ReplaceUserGenresVariables {
  userId: number;
  genreIds: number[];
}

export function useReplaceUserGenres() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ genreIds }: ReplaceUserGenresVariables) =>
      replaceUserGenres({ genreIds }),

    onSuccess: (genreIds, { userId }) => {
      queryClient.setQueryData(genresKeys.user(userId), genreIds);
    },
  });
}