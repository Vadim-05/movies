import type { MovieGenre } from "../../movies.types";

interface MovieGenresProps {
  genres: MovieGenre[];
}

export function MovieGenres({ genres }: MovieGenresProps) {
  if (!genres.length) return null;

  return (
    <ul
      className="mt-6 flex flex-wrap gap-2"
      aria-label="Movie Genres"
    >
      {genres.map(({ id, name }) => (
        <li
          key={id}
          className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-gray-300"
        >
          {name}
        </li>
      ))}
    </ul>
  );
}
