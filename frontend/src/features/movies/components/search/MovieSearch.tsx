import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { AsyncState } from "../../../../components/ui/async-state/AsyncState";
import { useDebounce } from "../../hooks/useDebounce";
import { MAX_SEARCH_LENGTH } from "../../movies.constants";
import { MovieCard } from "../card/MovieCard";
import { MoviePagination } from "./MoviePagination";
import type {
  MovieListItem,
  MoviesPagination,
} from "../../movies.types";

interface MovieSearchProps {
  search: string;
  pagination: MoviesPagination | null;
  movies: MovieListItem[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  isPlaceholderData: boolean;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
}

export function MovieSearch({
  search,
  pagination,
  movies,
  isLoading,
  isError,
  isFetching,
  isPlaceholderData,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onRetry,
}: MovieSearchProps) {
  const searchInputId = useId();

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState(search);

  const debouncedInput = useDebounce(input);

  useEffect(() => {
    setInput(search);
  }, [search]);

  useEffect(() => {
    if (debouncedInput !== search) {
      onSearchChange(debouncedInput);
    }
  }, [debouncedInput, search, onSearchChange]);

  const calculatePageSize = useCallback(() => {
    const grid = gridRef.current;

    if (!grid) return;

    const gridTemplateColumns =
      getComputedStyle(grid).gridTemplateColumns;

    const columns = gridTemplateColumns
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    if (columns === 0) return;

    onPageSizeChange(columns * 2);
  }, [onPageSizeChange]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const observer = new ResizeObserver(() => {
      calculatePageSize();
    });

    observer.observe(container);
    calculatePageSize();

    return () => observer.disconnect();
  }, [calculatePageSize]);

  const showEmptyState =
    !isLoading &&
    !isError &&
    !isPlaceholderData &&
    movies.length === 0;

  const showPagination =
    !isLoading &&
    !isPlaceholderData &&
    (pagination?.total ?? 0) > 0;

  return (
    <section className="relative space-y-7">
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -top-20 left-1/2 -z-10 h-64 
          w-[70%] -translate-x-1/2 rounded-full bg-red-600/[0.07] blur-[100px]
      "/>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-px w-7 bg-red-500" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-red-400">
              Cinema atmosphere
            </span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Find Your Movie
            <span className="text-red-500">.</span>
          </h2>

          <p className="text-xs text-gray-500 sm:text-sm">
            Discover stories that stay with you.
          </p>
        </div>
        <div className="w-full sm:max-w-[280px]">
          <label htmlFor={searchInputId} className="sr-only">
            Movie Search
          </label>

          <div className="group relative">
            <span className="
              pointer-events-none absolute inset-y-0 left-3 flex items-center 
              text-gray-500 transition-colors group-focus-within:text-red-400
            ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>

            <input
              id={searchInputId}
              type="search"
              value={input}
              maxLength={MAX_SEARCH_LENGTH}
              autoComplete="off"
              placeholder="Find a Movie..."
              onChange={(event) => setInput(event.target.value)}
              className="
                w-full rounded-xl border border-white/[0.09] bg-white/[0.035] 
                py-3 pl-10 pr-4 text-sm text-white outline-none backdrop-blur-xl 
                transition duration-300 placeholder:text-gray-600 hover:border-white/20 
                focus:border-red-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_25px_rgba(239,68,68,0.08)] 
                focus-visible:ring-2 focus-visible:ring-red-500/20
            "/>
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-red-500/40 via-white/[0.08] to-transparent" />
      <div ref={containerRef} className="min-w-0">
        <div
          ref={gridRef}
          aria-busy={isFetching}
          className={`
            grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 transition-opacity 
            duration-300 sm:grid-cols-[repeat(auto-fill,minmax(175px,1fr))] 
            sm:gap-4 lg:grid-cols-[repeat(auto-fill,minmax(211px,1fr))] xl:gap-5 
            ${isFetching && movies.length > 0 ? "opacity-50" : ""}
          `}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
      {isLoading ? (
        <AsyncState
          type="loading"
          message="Loading movies..."
        />
      ) : isError ? (
        <AsyncState
          type="error"
          message="Failed to load movies."
          action={{
            label: "Try Again",
            onClick: onRetry,
          }}
        />
      ) : showEmptyState ? (
        <AsyncState
          type="empty"
          message="No movies found."
        />
      ) : null}
      {showPagination && pagination && (
        <div className="border-t border-white/[0.07] pt-5">
          <MoviePagination
            pagination={pagination}
            disabled={isFetching}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </section>
  );
}