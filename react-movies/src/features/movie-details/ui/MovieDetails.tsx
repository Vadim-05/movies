import { Link } from "react-router-dom";
import { useMovieDetails } from "@/features/movie-details/model/useMovieDetails";
import { DeleteMovieButton } from "@/features/movie-delete";
import { getImageUrl } from "@/shared/lib/getImageUrl";
import { PageLoader } from "@/shared/ui/page-loader";
import { ErrorMessage } from "@/shared/ui/error-message";
import { NotFound } from "@/shared/ui/not-found";

type Props = {
  id: string;
};

export function MovieDetails({ id }: Props) {
  const { data: movie, isLoading, isError } = useMovieDetails(id);

  if (isLoading) return <PageLoader />;
  if (isError) return <ErrorMessage message="Failed to load movie" />;
  if (!movie) return <NotFound title="Movie not found" />;

  const { image, name, rating, description } = movie;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black px-6 py-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row">
        <div className="shrink-0">
          <img
            src={getImageUrl(image)}
            alt={name}
            className="
            mx-auto flex w-fit flex-col items-center justify-center
            aspect-[2/2] md:aspect-[2/3]
            w-full max-w-xs sm:max-w-sm md:w-60
            rounded-2xl object-cover shadow-2xl
          "
          />
        </div>

        <div className="flex flex-1 flex-col justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">{name}</h1>
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-3 py-1 text-sm text-yellow-400">
              ⭐ IMDb: {rating}
            </div>
            <p className="text-neutral-300 leading-relaxed">
              {description}
            </p>

          </div>
          <div className="flex flex-wrap gap-3 pt-6">
            <Link
              to={`/movie/edit/${id}`}
              className="
                link 
                rounded-lg
                bg-neutral-800 
                px-4 py-2 text-sm 
                font-medium text-white 
                backdrop-blur-md 
                transition hover:bg-neutral-700
              "
            >
              Edit
            </Link>
            <DeleteMovieButton movieId={Number(id)} />
          </div>
        </div>
      </div>
    </main>
  );
}