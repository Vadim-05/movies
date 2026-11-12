import type { MovieCharacter } from "../../movies.types";
import { useHorizontalSlider } from "../../hooks/useHorizontalSlider";
import { SliderButton } from "../recommendations/RecommendationsSlider";
import { MoviePoster } from "../shared/MoviePoster";

interface MovieActorsProps {
  actors: MovieCharacter[];
}

export function MovieActors({ actors }: MovieActorsProps) {
  const isAdmin = window.location.pathname.includes("/admin");

  const { trackRef, canScrollPrev, canScrollNext, scrollByPage } =
    useHorizontalSlider(actors.length);

  if (!actors.length) return null;

  const hasOverflow = canScrollPrev || canScrollNext;
  const sortedActors = [...actors].sort((a, b) => a.castOrder - b.castOrder);

  return (
    <section
      className="mt-10"
      aria-labelledby="cast-title"
      aria-roledescription="carousel"
    >
      <div className="flex items-end justify-between gap-4">
        <h2 id="cast-title" className="text-xl font-bold text-white">
          Cast
        </h2>

        {hasOverflow && (
          <div className="hidden shrink-0 gap-2 sm:flex">
            <SliderButton
              direction="prev"
              label="Previous cast members"
              disabled={!canScrollPrev}
              onClick={() => scrollByPage(-1)}
            />
            <SliderButton
              direction="next"
              label="Next cast members"
              disabled={!canScrollNext}
              onClick={() => scrollByPage(1)}
            />
          </div>
        )}
      </div>

      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label="Cast members"
        className="
          -mx-2 mt-2 flex snap-x snap-mandatory scroll-px-2
          gap-4 overflow-x-auto overscroll-x-contain
          px-2 py-2
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-red-500/60
          rounded-2xl
        "
      >
        {sortedActors.map((actor, index) => (
          <li
            key={actor.id}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${sortedActors.length}`}
            className={`
              min-w-0 shrink-0 snap-start overflow-hidden
              rounded-xl border border-white/10 bg-white/[0.03]
              basis-[calc((100%_-_1rem)/2.2)]
              sm:basis-[calc((100%_-_2rem)/3)]
              ${isAdmin
                ? "lg:basis-[calc((100%_-_2rem)/3)]"
                : "lg:basis-[calc((100%_-_3rem)/4)]"}
              xl:basis-[calc((100%_-_3rem)/5)]

            `}
            
          >
            <MoviePoster
              title={actor.characterName}
              posterUrl={actor.characterPhotoUrl}
            />

            <div className="p-3">
              <p className="break-words font-medium text-white">
                {actor.characterName}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
