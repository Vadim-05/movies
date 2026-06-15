import { createContext, useCallback, useContext, useMemo, useState} from "react";
import type { ModalItem, ModalOptions } from "@/shared/modal/modal.types";

type ModalContextType = {
  modals: ModalItem[];
  open: (content: React.ReactNode, options?: ModalOptions) => string;
  close: (id: string) => void;
  closeTop: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<ModalItem[]>([]);

  const runOnClose = useCallback((modal?: ModalItem) => {
    modal?.options?.onClose?.();
  }, []);

  const open = useCallback(
    (content: React.ReactNode, options?: ModalOptions) => {
      const id = crypto.randomUUID();

      setModals((prev) => [
        ...prev,
        { id, content, options },
      ]);

      return id;
    },
    []
  );

  const close = useCallback(
    (id: string) => {
      setModals((prev) => {
        const modal = prev.find((m) => m.id === id);

        runOnClose(modal);

        return prev.filter((m) => m.id !== id);
      });
    },
    [runOnClose]
  );

  const closeTop = useCallback(() => {
    setModals((prev) => {
      if (prev.length === 0) return prev;

      const last = prev[prev.length - 1];

      runOnClose(last);

      return prev.slice(0, -1);
    });
  }, [runOnClose]);

  const value = useMemo(
    () => ({
      modals,
      open,
      close,
      closeTop,
    }),
    [modals, open, close, closeTop]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  const ctx = useContext(ModalContext);

  if (!ctx) {
    throw new Error("ModalProvider is missing");
  }

  return ctx;
}