export type Movie = {
  id: number;
  name: string;
  image: string;
  rating: number;
  description: string;
  is_favorite: boolean;
};

export type MoviesResponse = {
  movies: Movie[];
  nextCursor: number | null;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  meta?: {
    nextCursor?: number | null;
  };
};