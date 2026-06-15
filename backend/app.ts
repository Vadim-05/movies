import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import { env } from "./config/env";

import movieRoutes from "./modules/movies/movie.routes";
import { requestId } from "./middlewares/requestId.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(compression());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

app.use(requestId);
app.use(loggerMiddleware);

app.use("/movies", movieRoutes);

const uploadsPath = path.resolve(process.cwd(), "uploads");

app.use(
  "/uploads",
  express.static(uploadsPath, {
    etag: false,
    maxAge: "1d",
  })
);

app.use(errorHandler);

export default app;