
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

function shouldRetryQuery(
  failureCount: number,
  error: Error,
): boolean {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status !== undefined && status >= 400 && status < 500) {
      return false;
    }
  }

  return failureCount < 1;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: shouldRetryQuery,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: false,
    },
  },
});
