export type Movie = {
  id: number;
  name: string;
  image: string;
  rating: number;
  description: string;
  is_favorite: boolean;
};

export type CreateMovieDto = {
  name: string;
  rating: number;
  description: string;
};

export type UpdateMovieDto = Partial<CreateMovieDto & { image: string }>;