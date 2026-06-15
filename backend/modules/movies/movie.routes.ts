import { Router } from "express";
import { upload } from "../../storage/multer";
import { MovieRepository } from "./movie.repository";
import { MovieService } from "./movie.service";
import { MovieController } from "./movie.controller";
import { LocalStorageService } from "../../storage/local-storage.service";

const router = Router();

const repo = new MovieRepository();
const storage = new LocalStorageService();
const service = new MovieService(repo, storage);
const controller = new MovieController(service);

router.post("/", upload.single("image"), controller.create);

router.get("/", controller.getAll);

router.get("/:id", controller.getById);

router.put("/:id", upload.single("image"), controller.update);

router.delete("/:id", controller.delete);

router.patch("/:id/favorite", controller.toggleFavorite);

export default router;