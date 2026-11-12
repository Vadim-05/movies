import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/auth.api";
import { authKeys } from "../auth.keys";
import type { AuthUser } from "../auth.types";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...authKeys.currentUser(), "update"],
    mutationFn: updateProfile,

    onSuccess: (updatedUser: AuthUser) => {
      queryClient.setQueryData<AuthUser>(
        authKeys.currentUser(),
        updatedUser,
      );
    },
  });
}
