import { Router } from "express";
import { validateBody } from "../../middlewares/validate-body.js";
import { requireAuth } from "../auth/auth.middleware.js";
import { GenresController } from "./genres.controller.js";
import { replaceSelectedGenresSchema } from "./genres.schemas.js";

const router = Router();
const controller = new GenresController();

router.get("/", controller.findMany);

router.get("/me", requireAuth, controller.findSelected);

router.put(
  "/me",
  requireAuth,
  validateBody(replaceSelectedGenresSchema),
  controller.replaceSelected,
);

export { router as genresRouter };