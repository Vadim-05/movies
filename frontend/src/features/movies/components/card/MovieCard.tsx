import { memo, useRef } from "react";
import type { PointerEvent } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { FavoriteButton } from "../../../favorites/components/FavoriteButton";
import { formatReleaseDate } from "../../utils/format-release-date";
import { MoviePoster } from "../shared/MoviePoster";

import type { MovieListItem } from "../../movies.types";

interface MovieCardProps {
  movie: MovieListItem;
}

export const MovieCard = memo(function MovieCard({
  movie,
}: MovieCardProps) {
  const cardRef = useRef<HTMLElement | null>(null);

  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  function handlePointerMove(
    event: PointerEvent<HTMLElement>,
  ) {
    const card = cardRef.current;

    if (!card || event.pointerType !== "mouse") return;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    const rotateY = ((percentX - 50) / 50) * 5;
    const rotateX = ((50 - percentY) / 50) * 5;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-5px)
      scale3d(1.015, 1.015, 1.015)
    `;

    card.style.setProperty("--pointer-x", `${percentX}%`);
    card.style.setProperty("--pointer-y", `${percentY}%`);
  }

  function handlePointerLeave() {
    const card = cardRef.current;

    if (!card) return;

    card.style.transform = "";
    card.style.setProperty("--pointer-x", "50%");
    card.style.setProperty("--pointer-y", "50%");
  }

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="
        group/card relative min-w-0 overflow-hidden
        rounded-xl border border-white/[0.08]
        bg-[#101014]
        shadow-[0_10px_30px_rgba(0,0,0,0.2)]
        [transform-style:preserve-3d]
        transition-[transform,border-color,box-shadow]
        duration-300 ease-out
        hover:border-white/25
        hover:shadow-[0_20px_45px_rgba(0,0,0,0.5)]
        motion-reduce:transition-none
        sm:rounded-2xl
      "
    >
      <Link
        to={isAdminRoute ? "/admin/movies/$id" : "/movie/$id"}
        params={{ id: String(movie.id) }}
        aria-label={`View Movie «${movie.title}»`}
        className="
          relative block overflow-hidden rounded-xl
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-inset
          focus-visible:ring-red-500
          sm:rounded-2xl
        "
      >
        <div className="relative overflow-hidden bg-[#17171d]">
          <div
            className="
              transition-transform duration-700 ease-out
              group-hover/card:scale-[1.045]
            "
          >
            <MoviePoster
              title={movie.title}
              posterUrl={movie.posterUrl}
            />
          </div>
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-0
              bg-gradient-to-t
              from-black/70 via-transparent to-black/10
              opacity-70 transition-opacity duration-500
              group-hover/card:opacity-100
            "
          />
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-0 z-[2]
              opacity-0 transition-opacity duration-300
              group-hover/card:opacity-100
            "
            style={{
              background:
                "radial-gradient(circle at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(255,255,255,0.2), transparent 45%)",
            }}
          />
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-0 z-[3]
              rounded-xl border border-white/0
              transition-colors duration-500
              group-hover/card:border-white/20
              sm:rounded-2xl
            "
          />
          {typeof movie.rating === "number" &&
            Number.isFinite(movie.rating) && (
              <div
                className="
                  absolute bottom-2 left-2 z-[4]
                  rounded-full border border-white/15
                  bg-black/60 px-2 py-1
                  text-[10px] font-semibold
                  text-amber-300
                  shadow-lg backdrop-blur-md
                  sm:bottom-3 sm:left-3
                  sm:text-xs
                "
              >
                <span aria-hidden="true">★</span>{" "}
                {movie.rating.toFixed(1)}
              </div>
            )}
        </div>
        <div className="relative space-y-2 p-2.5 sm:p-3">
          <h2
            className="
              line-clamp-2 min-h-9
              text-xs font-semibold leading-5
              text-white transition-colors duration-300
              group-hover/card:text-red-100
              sm:min-h-10 sm:text-sm
            "
          >
            {movie.title}
          </h2>

          <div
            className="
              flex items-center justify-between gap-2
              text-[10px] text-gray-500
              sm:text-xs
            "
          >
            <span>{formatReleaseDate(movie.releaseDate)}</span>

            <span
              aria-hidden="true"
              className="h-1 w-1 shrink-0 rounded-full bg-red-500/70"
            />
          </div>
        </div>
      </Link>
      <FavoriteButton
        movieId={movie.id}
        isFavorite={movie.isFavorite}
        className="
          absolute right-2 top-2 z-10
          rounded-full border border-white/15
          bg-black/50 shadow-lg backdrop-blur-md
          transition duration-300
          hover:scale-110 hover:bg-black/75
          sm:right-3 sm:top-3
        "
      />
    </article>
  );
});
