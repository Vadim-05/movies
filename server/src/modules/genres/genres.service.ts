import { AppError } from "../../errors/app-error.js";
import type {
  GenreItem,
  GenresRepository,
} from "./genres.repository.js";

export class GenresService {
  constructor(
    private readonly repository: GenresRepository,
  ) {}

  findMany(): Promise<GenreItem[]> {
    return this.repository.findMany();
  }

  findSelectedGenreIds(userId: number): Promise<number[]> {
    return this.repository.findSelectedGenreIds(userId);
  }

  async replaceSelectedGenreIds(
    userId: number,
    genreIds: number[],
  ): Promise<number[]> {
    const normalizedGenreIds = [...new Set(genreIds)];

    if (normalizedGenreIds.length === 0) {
      throw new AppError(
        "VALIDATION_ERROR",
        "At least one genre must be selected",
      );
    }

    const existingGenreIds =
      await this.repository.findExistingGenreIds(normalizedGenreIds);

    if (existingGenreIds.length !== normalizedGenreIds.length) {
      throw new AppError(
        "VALIDATION_ERROR",
        "One or more selected genres do not exist",
      );
    }

    await this.repository.replaceSelectedGenreIds(
      userId,
      normalizedGenreIds,
    );

    return normalizedGenreIds;
  }
}
