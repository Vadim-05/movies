import { createPortal } from "react-dom";
import { useEffect, useMemo } from "react";
import { useModalContext } from "@/shared/modal/ModalProvider";

export function ModalRenderer() {
  const { modals, close, closeTop } = useModalContext();

  const modalRoot = useMemo(
    () => document.getElementById("modal-root"),
    []
  );

  const topModal = modals.at(-1);

  const closeOnEsc = topModal?.options?.closeOnEsc ?? true;

  useEffect(() => {
    if (!topModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEsc) {
        closeTop();
      }
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [topModal, closeTop, closeOnEsc]);

  if (!modalRoot) return null;

  return createPortal(
    <>
      {modals.map((modal, index) => {
        const isTop = index === modals.length - 1;
        const overlayEnabled =
          modal.options?.closeOnOverlay ?? true;

        const handleOverlayClick = () => {
          if (!isTop) return;
          if (!overlayEnabled) return;
          close(modal.id);
        };

        return (
          <div
            key={modal.id}
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            style={{ zIndex: 1000 + index }}
            onClick={handleOverlayClick}
          >
            <div
              className="relative w-[90%] max-w-md rounded-2xl bg-neutral-900 p-6 text-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute right-3 top-3 text-neutral-400 hover:text-white"
                onClick={() => close(modal.id)}
              >
                ✕
              </button>

              {modal.content}
            </div>
          </div>
        );
      })}
    </>,
    modalRoot
  );
}