import { Link } from "react-router-dom";
import { FavoriteButton } from "@/features/favorites";
import { DeleteMovieButton } from "@/features/movie-delete";
import type { Movie } from "@/shared/movies/movie.types";
import { getImageUrl } from "@/shared/lib/getImageUrl";

type Props = {
  movie: Movie;
};

export function MovieCard({ movie }: Props) {
  return (
    <article className="
      group relative overflow-hidden 
      rounded-2xl bg-neutral-900 shadow-lg 
      transition-transform duration-300 hover:scale-[1.03]
    ">
      <Link
        to={`/movie/${movie.id}`}
        className="absolute inset-0 z-10"
      />
      <img
        src={getImageUrl(movie.image)}
        alt={movie.name}
        loading="lazy"
        className=" aspect-[2/2] h-full w-full object-cover transition duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="
        absolute right-3 top-3 z-20 
        flex flex-col gap-2 opacity-0 
        transition duration-200 group-hover:opacity-100
      ">
        <div onClick={(e) => e.stopPropagation()}>
          <FavoriteButton
            movieId={movie.id}
            isFavorite={movie.is_favorite}
          />
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <DeleteMovieButton movieId={movie.id} />
        </div>

        <Link
          to={`/movie/edit/${movie.id}`}
          onClick={(e) => e.stopPropagation()}
          className="
            link rounded-lg bg-neutral-800 
            px-4 py-2 text-sm font-medium text-white 
            backdrop-blur-md transition hover:bg-neutral-700
          "
        >
          Edit
        </Link>
      </div>
      <div className="absolute bottom-0 z-20 w-full p-3 text-white">
        <div className="text-sm font-semibold opacity-90">
          IMDb: {movie.rating}
        </div>
        <div className="truncate text-base font-bold">
          {movie.name}
        </div>

      </div>
    </article>
  );
}