import type { ReactNode } from "react";

interface AsyncStateProps {
  type: "loading" | "error" | "empty";
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

const STATE_STYLES = {
  loading: "text-gray-400",
  error: "text-red-400",
  empty: "text-gray-400",
} as const;

export function AsyncState({
  type,
  message,
  action,
  children,
}: AsyncStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
      <p
        role={type === "error" ? "alert" : "status"}
        className={`text-sm ${STATE_STYLES[type]}`}
      >
        {message}
      </p>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="
            rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white 
            transition hover:bg-red-700 focus-visible:outline-none 
            focus-visible:ring-2 focus-visible:ring-red-500 
            focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
          ">
          {action.label}
        </button>
      )}

      {children}
    </div>
  );
}