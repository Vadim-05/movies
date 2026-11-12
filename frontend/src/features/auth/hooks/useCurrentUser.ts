import { useQuery } from "@tanstack/react-query";

import { currentUserQueryOptions } from "../auth.queries";

export function useCurrentUser() {
  return useQuery(currentUserQueryOptions());
}