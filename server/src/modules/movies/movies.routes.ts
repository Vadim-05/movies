import { Router } from "express";
import {
  addFavoriteController,
  createMovieController,
  getFavoriteMoviesController,
  getMovieByIdController,
  getMoviesController,
  getMovieRecommendationsController,
  removeFavoriteController,
} from "./movies.controller.js";
import {
  optionalAuth,
  requireAuth,
} from "../auth/auth.middleware.js";

export const moviesRouter = Router();

moviesRouter.get("/", optionalAuth, getMoviesController);
moviesRouter.post("/", requireAuth, createMovieController);

moviesRouter.get("/favorites", requireAuth, getFavoriteMoviesController);
moviesRouter.get("/:id/recommendations", optionalAuth, getMovieRecommendationsController);
moviesRouter.get("/:id", optionalAuth, getMovieByIdController);

moviesRouter.post("/:id/favorite", requireAuth, addFavoriteController);
moviesRouter.delete("/:id/favorite", requireAuth, removeFavoriteController);
