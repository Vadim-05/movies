import { memo } from "react";
import type { MovieDetails } from "../../movies.types";
import { FavoriteButton } from "../../../favorites/components/FavoriteButton";
import { MovieActors } from "./MovieActors";
import { MovieGenres } from "./MovieGenres";
import { MovieMetadata } from "./MovieMetadata";
import { MoviePoster } from "../shared/MoviePoster";
import { MovieRecommendations } from "../recommendations/MovieRecommendation";

interface MovieDetailsContentProps {
  movie: MovieDetails;
  isAdmin?: boolean;
}

export const MovieDetailsContent = memo(function MovieDetailsContent({
  movie,
  isAdmin = false,
}: MovieDetailsContentProps) {
  const genres = movie.genres ?? [];
  const characters = movie.characters ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <article>
        <div
          className={
            isAdmin
              ? "grid items-start gap-8 min-[48rem]:flex min-[48rem]:flex-wrap min-[64rem]:grid min-[64rem]:grid-cols-[1fr_2fr] lg:gap-12"
              : "grid items-start gap-8 md:grid-cols-[280px_minmax(0,1fr)] lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-12"
          }
        >
          <div className="
            mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/10 
            bg-white/5 min-[48rem]:mx-0 min-[48rem]:max-w-[220px] min-[64rem]:max-w-none
          ">
            <MoviePoster
              title={movie.title}
              posterUrl={movie.posterUrl}
              priority
            />
          </div>

          <div className="min-w-0">
            <h1 className="break-words text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              {movie.title}
            </h1>

            <MovieMetadata movie={movie} />

            <div className="mt-5">
              <FavoriteButton
                movieId={movie.id}
                isFavorite={movie.isFavorite}
              />
            </div>

            <MovieGenres genres={genres} />

            <section className="mt-8">
              <h2 className="text-xl font-bold text-white">
               About the Movie
              </h2>

              <p className="mt-3 whitespace-pre-line leading-7 text-gray-300">
                {movie.description || "Description not available yet."}
              </p>
            </section>

            <MovieActors actors={characters} />

            {movie.trailerUrl && (
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-8 inline-flex rounded-xl bg-red-600 px-5 py-3 font-semibold 
                  text-white transition hover:bg-red-500 focus-visible:outline-none 
                  focus-visible:ring-2 focus-visible:ring-red-400
              ">
                Watch Trailer
                <span className="sr-only">
                  {" "}— Opens in a new tab.
                </span>
              </a>
            )}
          </div>
        </div>
      </article>

      <MovieRecommendations movieId={movie.id} />
    </div>
  );
});
