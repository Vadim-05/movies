import { useInfiniteQuery } from "@tanstack/react-query";
import { movieApi } from "@/shared/movies/movie.api";
import { useDebounce } from "@/shared/lib/useDebounce";

const LIMIT = 5;

export function useMovies(search: string) {
  const debouncedSearch = useDebounce(search, 400);

  return useInfiniteQuery({
    queryKey: ["movies", debouncedSearch],

    initialPageParam: 0,

    queryFn: ({ pageParam }) =>
      movieApi.getMovies({
        search: debouncedSearch,
        limit: LIMIT,
        cursor: pageParam,
      }),

    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}