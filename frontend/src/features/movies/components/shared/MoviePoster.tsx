
import { useEffect, useState } from "react";

interface MoviePosterProps {
  title: string;
  posterUrl: string | null;
  priority?: boolean;
}

export function MoviePoster({
  title,
  posterUrl,
  priority = false,
}: MoviePosterProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [posterUrl]);

  if (!posterUrl || hasError) {
    return (
      <div
        className="flex aspect-[2/3] w-full items-center justify-center bg-white/5 p-3 text-center text-sm text-gray-500"
        role="img"
        aria-label={`Poster for «${title}» is unavailable`}
      >
        Poster unavailable.
      </div>
    );
  }

  return (
    <img
      src={posterUrl}
      alt={`Movie Poster «${title}»`}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setHasError(true)}
      className="aspect-[2/3] w-full object-cover"
    />
  );
}
