import { ReactNode } from "react";

export type ModalOptions = {
  closeOnEsc?: boolean;
  closeOnOverlay?: boolean;
  onClose?: () => void;
};

export type ModalItem = {
  id: string;
  content: ReactNode;
  options?: ModalOptions;
};