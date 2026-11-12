
import type { MovieDetails } from "../../movies.types";
import { formatReleaseDate } from "../../utils/format-release-date";

interface MovieMetadataProps {
  movie: MovieDetails;
}

export function MovieMetadata({ movie }: MovieMetadataProps) {
  const {
    releaseDate,
    runtimeMinutes,
    originalLanguage,
    rating,
  } = movie;

  const formattedRating =
    typeof rating === "number" && Number.isFinite(rating)
      ? rating.toFixed(1)
      : null;

  return (
    <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
      {releaseDate && (
        <div>
          <dt className="sr-only">Release Date</dt>
          <dd>
            {formatReleaseDate(releaseDate, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </dd>
        </div>
      )}

      {runtimeMinutes != null && (
        <div>
          <dt className="sr-only">Runtime</dt>
          <dd>{runtimeMinutes} min</dd>
        </div>
      )}

      {originalLanguage && (
        <div>
          <dt className="sr-only">Original Language</dt>
          <dd>Language: {originalLanguage}</dd>
        </div>
      )}

      {formattedRating !== null && (
        <div>
          <dt className="sr-only">Rating</dt>
          <dd className="font-semibold text-amber-400">
            <span aria-hidden="true">★</span> {formattedRating}
          </dd>
        </div>
      )}
    </dl>
  );
}
