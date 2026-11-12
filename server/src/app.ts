import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { genresRouter } from "./modules/genres/genres.routes.js";
import { corsMiddleware } from "./middlewares/cors.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error-handler.js";
import { requestLogger } from "./middlewares/request-logger.js";
import { apiRateLimiter } from "./middlewares/rate-limiter.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { moviesRouter } from "./modules/movies/movies.routes.js";


export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(corsMiddleware);
app.use(requestLogger);
app.use(apiRateLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/genres", genresRouter);
app.use(notFoundHandler);
app.use(errorHandler);
