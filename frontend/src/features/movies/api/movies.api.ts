import { api } from "../../../lib/api";
import type { CreateMoviePayload } from "../movies.schema";
import type {
  MovieDetailsResponse,
  MovieRecommendationsResponse,
  MoviesListResponse,
  MoviesQueryParams,
} from "../movies.types";

export interface CreateMovieResponse {
  status: "success";
  data: {
    id: number;
    title: string;
  };
}

export async function getMovies(
  params: MoviesQueryParams,
  signal?: AbortSignal,
): Promise<MoviesListResponse> {
  const { genres, ...queryParams } = params;

  const { data } = await api.get<MoviesListResponse>("/movies", {
    params: {
      ...queryParams,
      ...(genres?.length
        ? { genres: genres.join(",") }
        : {}),
    },
    signal,
  });

  return data;
}

export async function getMovieById(
  id: number,
  signal?: AbortSignal,
): Promise<MovieDetailsResponse> {
  const { data } = await api.get<MovieDetailsResponse>(
    `/movies/${id}`,
    { signal },
  );

  return data;
}

export async function getMovieRecommendations(
  id: number,
  signal?: AbortSignal,
): Promise<MovieRecommendationsResponse> {
  const { data } = await api.get<MovieRecommendationsResponse>(
    `/movies/${id}/recommendations`,
    { signal },
  );

  return data;
}

export async function createMovie(
  payload: CreateMoviePayload,
): Promise<CreateMovieResponse> {
  const { data } = await api.post<CreateMovieResponse>(
    "/movies",
    payload,
  );

  return data;
}
