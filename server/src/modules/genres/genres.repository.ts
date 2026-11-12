export interface GenreItem {
    id: number;
    name: string;
  }
  
  export interface GenresRepository {
    findMany(): Promise<GenreItem[]>;
  
    findSelectedGenreIds(userId: number): Promise<number[]>;
  
    findExistingGenreIds(genreIds: number[]): Promise<number[]>;
  
    replaceSelectedGenreIds(
      userId: number,
      genreIds: number[],
    ): Promise<void>;
  }