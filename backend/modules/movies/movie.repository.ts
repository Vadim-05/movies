import { query } from "../../config/db";
import { Movie, CreateMovieDto, UpdateMovieDto } from "./movie.types";
import { PoolClient } from "pg";

export class MovieRepository {
  findById(id: number) {
    return query<Movie>(
      "SELECT * FROM movies WHERE id = $1",
      [id]
    ).then(r => r.rows[0] ?? null);
  }

  toggleFavorite(id: number, value: boolean) {
    return query<Movie>(
      `UPDATE movies
       SET is_favorite = $1
       WHERE id = $2
       RETURNING *`,
      [value, id]
    ).then(r => r.rows[0]);
  }

  findAll(search: string, limit: number, cursor?: number) {
    const values: any[] = [`%${search}%`, limit];

    let sql = `
      SELECT * FROM movies
      WHERE name ILIKE $1
    `;

    if (cursor) {
      values.push(cursor);
      sql += ` AND id < $3`;
    }

    sql += `
      ORDER BY id DESC
      LIMIT $2
    `;

    return query<Movie>(sql, values).then(r => r.rows);
  }

  create(
    client: PoolClient,
    data: CreateMovieDto & { image: string }
  ) {
    return client
      .query<Movie>(
        `INSERT INTO movies (
          name,
          image,
          rating,
          description,
          is_favorite
        )
        VALUES ($1,$2,$3,$4,false)
        RETURNING *`,
        [data.name, data.image, data.rating, data.description]
      )
      .then(r => r.rows[0]);
  }

  update(
    id: number,
    data: UpdateMovieDto & { image: string }
  ) {
    return query<Movie>(
      `UPDATE movies
       SET name = $1,
           image = $2,
           rating = $3,
           description = $4
       WHERE id = $5
       RETURNING *`,
      [data.name, data.image, data.rating, data.description, id]
    ).then(r => r.rows[0] ?? null);
  }

  delete(id: number) {
    return query<Movie>(
      "DELETE FROM movies WHERE id = $1 RETURNING *",
      [id]
    ).then(r => r.rows[0] ?? null);
  }
}