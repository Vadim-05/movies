import { Request, Response } from "express";
import { MovieService } from "./movie.service";
import { createMovieSchema } from "./movie.validation";

export class MovieController {
  constructor(private service: MovieService) {}

  create = async (req: Request, res: Response) => {
    const dto = createMovieSchema.parse(req.body);

    const movie = await this.service.create(dto, req.file);

    res.status(201).json({
      success: true,
      data: movie,
    });
  };

  toggleFavorite = async (req: Request, res: Response) => {
    const movie = await this.service.toggleFavorite(
      Number(req.params.id)
    );

    res.json({
      success: true,
      data: movie,
    });
  };

  getAll = async (req: Request, res: Response) => {
    const search = String(req.query.search || "");
    const limit = Number(req.query.limit || 10);
    const cursor = req.query.cursor
      ? Number(req.query.cursor)
      : undefined;

    const result = await this.service.findAll(
      search,
      limit,
      cursor
    );

    res.json({
      success: true,
      data: result.movies,
      meta: {
        nextCursor: result.nextCursor,
      },
    });
  };

  getById = async (req: Request, res: Response) => {
    const movie = await this.service.findById(
      Number(req.params.id)
    );

    res.json({
      success: true,
      data: movie,
    });
  };

  update = async (req: Request, res: Response) => {
    const dto = createMovieSchema.parse(req.body);

    const movie = await this.service.update(
      Number(req.params.id),
      dto,
      req.file
    );

    res.json({
      success: true,
      data: movie,
    });
  };

  delete = async (req: Request, res: Response) => {
    const movie = await this.service.delete(
      Number(req.params.id)
    );

    res.json({
      success: true,
      data: movie,
    });
  };
}