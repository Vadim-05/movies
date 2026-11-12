import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../api/auth.api";
import { authKeys } from "../auth.keys";
import type { LoginOutput } from "../auth.schemas";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginOutput) => login(input),

    onSuccess: async (user) => {
      await queryClient.cancelQueries({
        queryKey: authKeys.currentUser(),
        exact: true,
      });

      queryClient.setQueryData(authKeys.currentUser(), user);
    },
  });
}
