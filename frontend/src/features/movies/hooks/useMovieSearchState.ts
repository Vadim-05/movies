import { useCallback, useState } from "react";
import { MAX_SEARCH_LENGTH } from "../movies.constants";

export interface MovieSearchUpdates {
  search?: string;
  page?: number;
}

interface UseMovieSearchStateOptions {
  search: string;
  page: number;
  updateSearch: (
    updates: MovieSearchUpdates,
    replace?: boolean,
  ) => Promise<void>;
}

export function useMovieSearchState({
  search,
  page,
  updateSearch,
}: UseMovieSearchStateOptions) {
  const [pageSize, setPageSize] = useState<number | null>(null);
  const [isPageResetPending, setIsPageResetPending] = useState(false);

  const onSearchChange = useCallback(
    (value: string) => {
      const nextSearch = value.trim().slice(0, MAX_SEARCH_LENGTH);

      if (nextSearch === search) return;

      void updateSearch(
        {
          search: nextSearch,
          page: 1,
        },
        true,
      ).catch(() => undefined);
    },
    [search, updateSearch],
  );

  const onPageChange = useCallback(
    (nextPage: number) => {
      if (
        !Number.isSafeInteger(nextPage) ||
        nextPage < 1 ||
        nextPage === page ||
        isPageResetPending
      ) {
        return;
      }

      void updateSearch({
        page: nextPage,
      }).catch(() => undefined);
    },
    [page, isPageResetPending, updateSearch],
  );

  const onPageSizeChange = useCallback(
    (nextPageSize: number) => {
      if (
        !Number.isSafeInteger(nextPageSize) ||
        nextPageSize < 1 ||
        nextPageSize === pageSize ||
        isPageResetPending
      ) {
        return;
      }

      const previousPageSize = pageSize;

      setPageSize(nextPageSize);

      if (previousPageSize === null || page === 1) {
        return;
      }

      setIsPageResetPending(true);

      void updateSearch(
        {
          page: 1,
        },
        true,
      )
        .catch(() => {
          setPageSize(previousPageSize);
        })
        .finally(() => {
          setIsPageResetPending(false);
        });
    },
    [page, pageSize, isPageResetPending, updateSearch],
  );

  return {
    search,
    page,
    pageSize,
    isPageResetPending,

    isSearchReady: pageSize !== null && !isPageResetPending,

    onSearchChange,
    onPageChange,
    onPageSizeChange,
  };
}