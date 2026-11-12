import { AsyncState } from "../../../../components/ui/async-state/AsyncState";
import { useMovieRecommendations } from "../../hooks/useMovie";
import { RecommendationsSlider } from "./RecommendationsSlider";

interface MovieRecommendationsProps {
  movieId: number;
}

export function MovieRecommendations({
  movieId,
}: MovieRecommendationsProps) {
  const { data, isPending, isError, refetch } =
    useMovieRecommendations(movieId);

  if (isPending) return null;

  if (isError) {
    return (
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          You Might Also Like
        </h2>

        <AsyncState
          type="error"
          message="Failed to load recommendations."
          action={{
            label: "Спробувати ще раз",
            onClick: () => void refetch(),
          }}
        />
      </section>
    );
  }

  const movies = data?.data ?? [];

  if (!movies.length) return null;

  return <RecommendationsSlider movies={movies} />;
}