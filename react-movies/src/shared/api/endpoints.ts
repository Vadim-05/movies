export const endpoints = {
  movies: "/movies",
  movie: (id: string | number) => `/movies/${id}`,
  favorite: (id: string | number) => `/movies/${id}/favorite`,
} as const;