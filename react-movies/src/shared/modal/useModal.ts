import { useCallback } from "react";
import { useModalContext } from "@/shared/modal/ModalProvider";
import type { ModalOptions } from "@/shared/modal/modal.types";

export function useModal() {
  const { open, close, closeTop } = useModalContext();

  const openModal = useCallback(
    (content: React.ReactNode, options?: ModalOptions) => {
      return open(content, options);
    },
    [open]
  );

  return {
    open: openModal,
    close,
    closeTop,
  };
}