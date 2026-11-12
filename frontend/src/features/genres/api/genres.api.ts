import { api } from "../../../lib/api";
import type { Genre } from "../genres.types";

interface GenresResponse {
  success: boolean;
  data: {
    items: Genre[];
  };
}

interface UserGenresResponse {
  success: boolean;
  data: {
    genreIds: number[];
  };
}

interface ReplaceUserGenresRequest {
  genreIds: number[];
}

function isValidGenreIds(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.every((id) => Number.isSafeInteger(id) && id > 0)
  );
}

export async function getGenres(
  signal?: AbortSignal,
): Promise<Genre[]> {
  const { data } = await api.get<GenresResponse>("/genres", {
    signal,
  });

  if (!data.success || !Array.isArray(data.data?.items)) {
    throw new Error("Invalid genres API response");
  }

  return data.data.items;
}

export async function getUserGenres(
  signal?: AbortSignal,
): Promise<number[]> {
  const { data } = await api.get<UserGenresResponse>("/genres/me", {
    signal,
  });

  if (!data.success || !isValidGenreIds(data.data?.genreIds)) {
    throw new Error("Invalid user genres API response");
  }

  return data.data.genreIds;
}

export async function replaceUserGenres(
  payload: ReplaceUserGenresRequest,
): Promise<number[]> {
  const { data } = await api.put<UserGenresResponse>(
    "/genres/me",
    payload,
  );

  if (!data.success || !isValidGenreIds(data.data?.genreIds)) {
    throw new Error("Invalid user genres API response");
  }

  return data.data.genreIds;
}