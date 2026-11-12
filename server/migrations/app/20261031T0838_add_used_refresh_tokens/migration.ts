#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/8df94a7592b6c13fb5a20af5ad6389472c5c343ef9d11b9b0e1cd85887b1399c/contract';
import endContract from '../../snapshots/8df94a7592b6c13fb5a20af5ad6389472c5c343ef9d11b9b0e1cd85887b1399c/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/c4ee3f808b75f5fd0a6ae260101cfb24a635e1cf7943288c570b493af06f91c1/contract';
import startContract from '../../snapshots/c4ee3f808b75f5fd0a6ae260101cfb24a635e1cf7943288c570b493af06f91c1/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Actor',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('photoUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'FavoriteMovie',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('movieId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['userId', 'movieId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Genre',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Movie',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('originalLanguage', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('posterUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('rating', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('releaseDate', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('runtimeMinutes', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('trailerUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'MovieActor',
        columns: [
          col('actorId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('castOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('characterName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('movieId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['movieId', 'actorId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'MovieGenre',
        columns: [
          col('genreId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('movieId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['movieId', 'genreId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'UsedRefreshToken',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sessionId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('usedAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumnWithTemporaryDefault({
        schema: 'public',
        table: 'AuthSession',
        column: 'absoluteExpiresAt',
        type: 'timestamptz',
        temporaryDefault: sql`'epoch'`,
      }),
      this.addUnique({
        schema: 'public',
        table: 'Genre',
        constraint: 'Genre_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'UsedRefreshToken',
        constraint: 'UsedRefreshToken_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Actor',
        index: 'Actor_name_idx_ce87e6ba',
        columns: ['name'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AuthSession',
        index: 'AuthSession_absoluteExpiresAt_idx_1b08abe9',
        columns: ['absoluteExpiresAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'FavoriteMovie',
        index: 'FavoriteMovie_movieId_idx_8cb9f9db',
        columns: ['movieId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'FavoriteMovie',
        index: 'FavoriteMovie_userId_createdAt_idx_f726f04a',
        columns: ['userId', 'createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'FavoriteMovie',
        index: 'FavoriteMovie_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Movie',
        index: 'Movie_rating_idx_fcb0b199',
        columns: ['rating'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Movie',
        index: 'Movie_releaseDate_idx_6baed0ae',
        columns: ['releaseDate'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Movie',
        index: 'Movie_title_idx_1c94c7b6',
        columns: ['title'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'MovieActor',
        index: 'MovieActor_actorId_idx_a58f6b4b',
        columns: ['actorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'MovieActor',
        index: 'MovieActor_actorId_movieId_idx_0e65af2d',
        columns: ['actorId', 'movieId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'MovieActor',
        index: 'MovieActor_movieId_castOrder_idx_ef7a6e6e',
        columns: ['movieId', 'castOrder'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'MovieActor',
        index: 'MovieActor_movieId_idx_8cb9f9db',
        columns: ['movieId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'MovieGenre',
        index: 'MovieGenre_genreId_idx_8fce6a7b',
        columns: ['genreId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'MovieGenre',
        index: 'MovieGenre_genreId_movieId_idx_9090cb08',
        columns: ['genreId', 'movieId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'MovieGenre',
        index: 'MovieGenre_movieId_idx_8cb9f9db',
        columns: ['movieId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'UsedRefreshToken',
        index: 'UsedRefreshToken_sessionId_idx_29f415d4',
        columns: ['sessionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'UsedRefreshToken',
        index: 'UsedRefreshToken_sessionId_usedAt_idx_719d6475',
        columns: ['sessionId', 'usedAt'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'FavoriteMovie',
        foreignKey: {
          name: 'FavoriteMovie_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'FavoriteMovie',
        foreignKey: {
          name: 'FavoriteMovie_movieId_fkey',
          columns: ['movieId'],
          references: { schema: 'public', table: 'Movie', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'MovieActor',
        foreignKey: {
          name: 'MovieActor_movieId_fkey',
          columns: ['movieId'],
          references: { schema: 'public', table: 'Movie', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'MovieActor',
        foreignKey: {
          name: 'MovieActor_actorId_fkey',
          columns: ['actorId'],
          references: { schema: 'public', table: 'Actor', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'MovieGenre',
        foreignKey: {
          name: 'MovieGenre_movieId_fkey',
          columns: ['movieId'],
          references: { schema: 'public', table: 'Movie', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'MovieGenre',
        foreignKey: {
          name: 'MovieGenre_genreId_fkey',
          columns: ['genreId'],
          references: { schema: 'public', table: 'Genre', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'UsedRefreshToken',
        foreignKey: {
          name: 'UsedRefreshToken_sessionId_fkey',
          columns: ['sessionId'],
          references: { schema: 'public', table: 'AuthSession', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
