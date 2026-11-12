import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface FeedbackModalProps {
  open: boolean;
  status: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  onRetry?: () => void;
}

export function FeedbackModal({
  open,
  status,
  title,
  message,
  onClose,
  onConfirm,
  onRetry,
}: FeedbackModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const isSuccess = status === "success";

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!open || !dialog) return;

    dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const handleAction = () => {
    if (isSuccess) {
      onClose();
      onConfirm?.();
      return;
    }

    if (onRetry) {
      onRetry();
      return;
    }

    onClose();
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      role={isSuccess ? "dialog" : "alertdialog"}
      aria-labelledby="feedback-modal-title"
      aria-describedby="feedback-modal-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="
        m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border 
        border-white/10 bg-[#111318] p-7 text-center text-white 
        shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm
    ">
      <div
        className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${
          isSuccess
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-red-500/10 text-red-400"
        }`}
      >
        {isSuccess ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-9 w-9"
            aria-hidden="true"
          >
            <path
              d="m5 12 4 4L19 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-9 w-9"
            aria-hidden="true"
          >
            <path
              d="M12 9v4m0 4h.01M10.3 3.86 1.82 18.5A2 2 0 0 0 3.55 21h16.9a2 2 0 0 0 1.73-2.5L13.7 3.86a2 2 0 0 0-3.4 0Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <h2
        id="feedback-modal-title"
        className="text-xl font-bold"
      >
        {title}
      </h2>

      <p
        id="feedback-modal-description"
        className="mt-3 text-sm leading-6 text-gray-400"
      >
        {message}
      </p>

      <button
        type="button"
        onClick={handleAction}
        className={`mt-7 w-full rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors ${
          isSuccess
            ? "bg-emerald-600 hover:bg-emerald-500"
            : "bg-red-600 hover:bg-red-500"
        }`}
      >
        {isSuccess ? "ОК" : "Try Again"}
      </button>
    </dialog>,
    document.body,
  );
}
