import { MovieRepository } from "./movie.repository";
import { StorageService } from "../../storage/storage.interface";
import { CreateMovieDto } from "./movie.types";
import { withTransaction } from "../../config/db";
import { AppError } from "../../utils/AppError";

export class MovieService {
  constructor(
    private repo: MovieRepository,
    private storage: StorageService
  ) {}

  async toggleFavorite(id: number) {
    const movie = await this.repo.findById(id);
    if (!movie) throw new AppError("Not found", 404);

    return this.repo.toggleFavorite(id, !movie.is_favorite);
  }

  async findAll(search: string, limit: number, cursor?: number) {
    const movies = await this.repo.findAll(search, limit, cursor);

    return {
      movies,
      nextCursor:
        movies.length === limit
          ? movies[movies.length - 1].id
          : null,
    };
  }

  async findById(id: number) {
    const movie = await this.repo.findById(id);
    if (!movie) throw new AppError("Not found", 404);

    return movie;
  }

  async create(dto: CreateMovieDto, file?: Express.Multer.File) {
    let image = "";

    try {
      if (file) {
        image = await this.storage.upload(file);
      }

      return await withTransaction(client =>
        this.repo.create(client, { ...dto, image })
      );
    } catch (e) {
      if (image) await this.storage.delete(image);
      throw e;
    }
  }

  async update(id: number, dto: CreateMovieDto, file?: Express.Multer.File) {
    const movie = await this.repo.findById(id);
    if (!movie) throw new AppError("Not found", 404);

    let image = movie.image;

    if (file) {
      image = await this.storage.upload(file);
    }

    const updated = await this.repo.update(id, { ...dto, image });

    if (file && movie.image) {
      await this.storage.delete(movie.image);
    }

    return updated;
  }

  async delete(id: number) {
    const movie = await this.repo.findById(id);
    if (!movie) throw new AppError("Not found", 404);

    await this.repo.delete(id);

    if (movie.image) {
      await this.storage.delete(movie.image);
    }

    return movie;
  }
}