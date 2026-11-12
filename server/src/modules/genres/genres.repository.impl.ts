import { db } from "../../prisma/db.js";
import type {
  GenreItem,
  GenresRepository,
} from "./genres.repository.js";

export class DatabaseGenresRepository implements GenresRepository {
  async findMany(): Promise<GenreItem[]> {
    const genres: GenreItem[] = [];

    for await (const genre of db.orm.public.Genre
      .select("id", "name")
      .orderBy((genre) => genre.name.asc())
      .all()) {
      genres.push(genre);
    }

    return genres;
  }

  async findSelectedGenreIds(userId: number): Promise<number[]> {
    const genreIds: number[] = [];

    for await (const userGenre of db.orm.public.UserGenre
      .where({ userId })
      .select("genreId")
      .all()) {
      genreIds.push(userGenre.genreId);
    }

    return genreIds;
  }

  async findExistingGenreIds(genreIds: number[]): Promise<number[]> {
    if (genreIds.length === 0) {
      return [];
    }

    const existingIds: number[] = [];

    for await (const genre of db.orm.public.Genre
      .where((genre) => genre.id.in(genreIds))
      .select("id")
      .all()) {
      existingIds.push(genre.id);
    }

    return existingIds;
  }

  async replaceSelectedGenreIds(
    userId: number,
    genreIds: number[],
  ): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.orm.public.UserGenre
        .where({ userId })
        .deleteAll();

      await tx.orm.public.UserGenre.createAll(
        genreIds.map((genreId) => ({
          userId,
          genreId,
        })),
      );
    });
  }
}
