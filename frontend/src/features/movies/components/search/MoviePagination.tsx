import type { MoviesPagination } from "../../movies.types";

interface MoviePaginationProps {
  pagination: MoviesPagination;
  disabled?: boolean;
  onPageChange: (page: number) => void;
}

const BUTTON_CLASS = [
  "flex h-10 items-center justify-center gap-2 rounded-lg",
  "border border-white/10 bg-white/[0.04] px-4",
  "text-sm font-medium text-gray-300 transition-colors",
  "hover:bg-white/10 hover:text-white",
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-red-500 focus-visible:ring-offset-2",
  "focus-visible:ring-offset-gray-950",
  "disabled:pointer-events-none disabled:opacity-40",
].join(" ");

export function MoviePagination({
  pagination,
  disabled = false,
  onPageChange,
}: MoviePaginationProps) {
  const { page, totalPages } = pagination;

  if (
    !Number.isSafeInteger(page) ||
    !Number.isSafeInteger(totalPages) ||
    page < 1 ||
    totalPages < 1 ||
    page > totalPages ||
    totalPages === 1
  ) {
    return null;
  }

  return (
    <nav
      aria-label="Movie Pagination"
      className="flex flex-col items-center justify-between gap-4 sm:flex-row"
    >
      <p
        className="text-sm text-gray-400"
        aria-live="polite"
        aria-atomic="true"
      >
        Page{" "}
        <span className="font-semibold text-white">
          {page}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-white">
          {totalPages}
        </span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={BUTTON_CLASS}
          aria-label="Go to previous page"
        >
          <span aria-hidden="true">←</span>
          Back
        </button>

        <button
          type="button"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={BUTTON_CLASS}
          aria-label="Go to next page"
        >
          Next
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </nav>
  );
}
