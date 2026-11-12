import { createFileRoute } from "@tanstack/react-router";
import { AsyncState } from "../../../components/ui/async-state/AsyncState";
import { CinemaAtmosphere } from "../../../components/ui/cinema-atmosphere/CinemaAtmosphere";
import { MovieDetailsContent } from "../../../features/movies/components/details/MovieDetailsContent";
import { useMovie } from "../../../features/movies/hooks/useMovie";

export const Route = createFileRoute("/_public/movie/$id")({
  component: MovieDetailsPage,
});

const CONTAINER_CLASS_NAME =
  "relative z-10 mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 xl:px-12";

function MovieDetailsPage() {
  const { id } = Route.useParams();
  const navigate = Route.useNavigate();

  const movieId = Number(id);
  const isValidId = Number.isSafeInteger(movieId) && movieId > 0;

  const { data, isPending, isError } = useMovie(
    movieId,
    isValidId,
  );

  const content = !isValidId ? (
    <AsyncState
      type="error"
      message="Invalid movie ID."
    />
  ) : isPending ? (
    <AsyncState
      type="loading"
      message="Loading movie..."
    />
  ) : isError || !data?.data ? (
    <AsyncState
      type="error"
      message="Movie not found."
      action={{
        label: "Back to Movies",
        onClick: () => {
          void navigate({
            to: "/",
            search: {
              search: "",
              page: 1,
            },
          });
        },
      }}
    />
  ) : (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-red-950/[0.08] blur-[90px] sm:-inset-10"
      />

      <MovieDetailsContent movie={data.data} />
    </div>
  );

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#09090d]">
      <CinemaAtmosphere />

      <div className={CONTAINER_CLASS_NAME}>{content}</div>
    </main>
  );
}