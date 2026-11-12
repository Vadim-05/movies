import type { Request, Response } from "express";
import { MoviesService } from "./movies.service.js";
import { DatabaseMoviesRepository } from "./database-movies.repository.js";
import {
  createMovieSchema,
  movieIdSchema,
  moviesQuerySchema,
  recommendationsQuerySchema,
} from "./movies.schemas.js";

const moviesService = new MoviesService(
  new DatabaseMoviesRepository(),
);

function getAuthenticatedUserId(req: Request): number {
  const userId = req.auth?.userId;

  if (userId === undefined) {
    throw new Error("Authenticated user ID is missing.");
  }

  return userId;
}

function sendMovieNotFound(res: Response): void {
  res.status(404).json({
    status: "error",
    error: {
      code: "MOVIE_NOT_FOUND",
      message: "Movie not found.",
    },
  });
}

export async function createMovieController(
  req: Request,
  res: Response,
): Promise<void> {
  const input = createMovieSchema.parse(req.body);
  const movie = await moviesService.createMovie(input);

  res.status(201).json({
    status: "success",
    data: movie,
  });
}

export async function getMoviesController(
  req: Request,
  res: Response,
): Promise<void> {
  const query = moviesQuerySchema.parse(req.query);

  const result = await moviesService.getMovies(
    query,
    req.auth?.userId,
  );

  res.status(200).json({
    status: "success",
    data: result.items,
    pagination: result.pagination,
  });
}

export async function getFavoriteMoviesController(
  req: Request,
  res: Response,
): Promise<void> {
  const query = moviesQuerySchema.parse(req.query);
  const userId = getAuthenticatedUserId(req);

  const result = await moviesService.getFavoriteMovies(
    query,
    userId,
  );

  res.status(200).json({
    status: "success",
    data: result.items,
    pagination: result.pagination,
  });
}

export async function getMovieByIdController(
  req: Request,
  res: Response,
): Promise<void> {
  const id = movieIdSchema.parse(req.params.id);

  const movie = await moviesService.getMovieById(
    id,
    req.auth?.userId,
  );

  if (!movie) {
    sendMovieNotFound(res);
    return;
  }

  res.status(200).json({
    status: "success",
    data: movie,
  });
}

export async function getMovieRecommendationsController(
  req: Request,
  res: Response,
): Promise<void> {
  const movieId = movieIdSchema.parse(req.params.id);
  const { limit } = recommendationsQuerySchema.parse(req.query);

  const recommendations = await moviesService.getRecommendations(
    movieId,
    limit,
    req.auth?.userId,
  );

  res.status(200).json({
    status: "success",
    data: recommendations,
  });
}

export async function addFavoriteController(
  req: Request,
  res: Response,
): Promise<void> {
  const movieId = movieIdSchema.parse(req.params.id);
  const userId = getAuthenticatedUserId(req);

  const added = await moviesService.addFavorite(movieId, userId);

  if (!added) {
    sendMovieNotFound(res);
    return;
  }

  res.status(204).send();
}

export async function removeFavoriteController(
  req: Request,
  res: Response,
): Promise<void> {
  const movieId = movieIdSchema.parse(req.params.id);

  await moviesService.removeFavorite(
    movieId,
    getAuthenticatedUserId(req),
  );

  res.status(204).send();
}
