import { queryOptions } from "@tanstack/react-query";
import { getCurrentUser } from "./api/auth.api";
import { authKeys } from "./auth.keys";

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey: authKeys.currentUser(),
    queryFn: ({ signal }) => getCurrentUser(signal),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}