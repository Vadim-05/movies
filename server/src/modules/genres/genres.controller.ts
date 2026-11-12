import type { RequestHandler } from "express";
import { AppError } from "../../errors/app-error.js";
import { DatabaseGenresRepository } from "./genres.repository.impl.js";
import { GenresService } from "./genres.service.js";

const genresService = new GenresService(
  new DatabaseGenresRepository(),
);

function getAuthenticatedUserId(
  userId: number | undefined,
): number {
  if (userId === undefined) {
    throw new AppError(
      "UNAUTHORIZED",
      "Authentication required",
    );
  }

  return userId;
}

function setNoStoreHeader(
  res: Parameters<RequestHandler>[1],
): void {
  res.setHeader("Cache-Control", "no-store");
}

export class GenresController {
  findMany: RequestHandler = async (_req, res) => {
    const items = await genresService.findMany();

    res.status(200).json({
      success: true,
      data: { items },
    });
  };

  findSelected: RequestHandler = async (req, res) => {
    const userId = getAuthenticatedUserId(req.auth?.userId);

    const genreIds =
      await genresService.findSelectedGenreIds(userId);

    setNoStoreHeader(res);

    res.status(200).json({
      success: true,
      data: { genreIds },
    });
  };

  replaceSelected: RequestHandler = async (req, res) => {
    const userId = getAuthenticatedUserId(req.auth?.userId);

    const genreIds = await genresService.replaceSelectedGenreIds(
      userId,
      req.body.genreIds,
    );

    setNoStoreHeader(res);

    res.status(200).json({
      success: true,
      data: { genreIds },
    });
  };
}
