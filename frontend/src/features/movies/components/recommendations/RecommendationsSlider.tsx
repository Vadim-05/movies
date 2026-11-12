import { useHorizontalSlider } from "../../hooks/useHorizontalSlider";
import { MovieCard } from "../card/MovieCard";
import type { MovieListItem } from "../../movies.types";

interface RecommendationsSliderProps {
  movies: MovieListItem[];
}

export function RecommendationsSlider({
  movies,
}: RecommendationsSliderProps) {
  const { trackRef, canScrollPrev, canScrollNext, scrollByPage } =
    useHorizontalSlider(movies.length);

  const hasOverflow = canScrollPrev || canScrollNext;

  return (
    <section
      className="mt-16"
      aria-labelledby="recommendations-title"
      aria-roledescription="carousel"
    >
      <div className="flex items-end justify-between gap-4">
        <h2
          id="recommendations-title"
          className="text-2xl font-bold text-white sm:text-3xl"
        >
          You Might Also Like
        </h2>

        {hasOverflow && (
          <div className="hidden shrink-0 gap-2 sm:flex">
            <SliderButton
              direction="prev"
              label="Previous recommendations"
              disabled={!canScrollPrev}
              onClick={() => scrollByPage(-1)}
            />
            <SliderButton
              direction="next"
              label="Next recommendations"
              disabled={!canScrollNext}
              onClick={() => scrollByPage(1)}
            />
          </div>
        )}
      </div>

      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label="Recommended movies"
        className="
          -mx-2 mt-4 flex snap-x snap-mandatory scroll-px-2
          gap-4 overflow-x-auto overscroll-x-contain
          px-2 py-3
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-red-500/60
          rounded-2xl
          sm:gap-5
        "
      >
        {movies.map((movie, index) => (
          <li
            key={movie.id}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${movies.length}`}
            className="
              shrink-0 snap-start
              basis-[calc((100%_-_1rem)/2.2)]
              sm:basis-[calc((100%_-_2.5rem)/3)]
              lg:basis-[calc((100%_-_3.75rem)/4)]
              xl:basis-[calc((100%_-_5rem)/5)]
            "
          >
            <MovieCard movie={movie} />
          </li>
        ))}
      </ul>
    </section>
  );
}

interface SliderButtonProps {
  direction: "prev" | "next";
  label: string;
  disabled: boolean;
  onClick: () => void;
}

export function SliderButton({
  direction,
  label,
  disabled,
  onClick,
}: SliderButtonProps) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="
        grid size-10 place-items-center rounded-full
        border border-white/10 bg-white/5 text-white
        transition-colors duration-200
        hover:border-white/25 hover:bg-white/10
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-red-500
        disabled:cursor-not-allowed disabled:opacity-30
        disabled:hover:border-white/10 disabled:hover:bg-white/5
      "
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={isPrev ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
      </svg>
    </button>
  );
}