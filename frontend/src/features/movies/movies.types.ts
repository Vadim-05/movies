export interface MovieListItem {
  id: number;
  title: string;
  posterUrl: string | null;
  releaseDate: string | null;
  originalLanguage: string | null;
  rating: number | null;
  isFavorite: boolean;
}

export interface MovieGenre {
  id: number;
  name: string;
}

export interface MovieCharacter {
  id: number;
  characterName: string;
  characterPhotoUrl: string | null;
  castOrder: number;
}

export interface MovieDetails extends MovieListItem {
  description: string;
  runtimeMinutes: number | null;
  trailerUrl: string | null;
  createdAt: string;
  updatedAt: string;
  genres: MovieGenre[];
  characters: MovieCharacter[];
}

export interface MoviesQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  genres?: number[];
}

export interface MoviesPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface MoviesListResponse {
  status: "success";
  data: MovieListItem[];
  pagination: MoviesPagination;
}

export interface MovieDetailsResponse {
  status: "success";
  data: MovieDetails;
}

export interface MovieRecommendationsResponse {
  status: "success";
  data: MovieListItem[];
}
