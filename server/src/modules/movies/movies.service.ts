import type {
  MovieDetails,
  MovieListItem,
  MovieListResult,
  MoviesRepository,
} from "./movies.repository.js";
import type {
  CreateMovieInput,
  MoviesQuery,
} from "./movies.schemas.js";

export interface PaginatedMovies {
  items: MovieListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export class MoviesService {
  constructor(
    private readonly moviesRepository: MoviesRepository,
  ) {}

  private createPaginatedResult(
    result: MovieListResult,
    query: MoviesQuery,
  ): PaginatedMovies {
    const { page, pageSize } = query;
    const { items, total } = result;

    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getMovies(
    query: MoviesQuery,
    userId?: number,
  ): Promise<PaginatedMovies> {
    const result = await this.moviesRepository.findMany(query, userId);

    return this.createPaginatedResult(result, query);
  }

  async getFavoriteMovies(
    query: MoviesQuery,
    userId: number,
  ): Promise<PaginatedMovies> {
    const result = await this.moviesRepository.findFavoriteMany(
      query,
      userId,
    );

    return this.createPaginatedResult(result, query);
  }

  createMovie(input: CreateMovieInput): Promise<MovieDetails> {
    return this.moviesRepository.create(input);
  }

  getMovieById(
    id: number,
    userId?: number,
  ): Promise<MovieDetails | null> {
    return this.moviesRepository.findById(id, userId);
  }

  getRecommendations(
    movieId: number,
    limit: number,
    userId?: number,
  ): Promise<MovieListItem[]> {
    return this.moviesRepository.findRecommendations(
      movieId,
      limit,
      userId,
    );
  }

  addFavorite(movieId: number, userId: number): Promise<boolean> {
    return this.moviesRepository.addFavorite(movieId, userId);
  }

  removeFavorite(movieId: number, userId: number): Promise<void> {
    return this.moviesRepository.removeFavorite(movieId, userId);
  }
}
