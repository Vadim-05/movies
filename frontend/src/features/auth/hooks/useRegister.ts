import { useMutation } from "@tanstack/react-query";
import { register } from "../api/auth.api";
import type { RegisterOutput } from "../auth.schemas";

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterOutput) => register(input),
  });
}
