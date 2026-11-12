#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/18bcf2796932ab7711e9586762b2efd4541f4b716dbc3daeee495cae406e8028/contract';
import startContract from '../../snapshots/18bcf2796932ab7711e9586762b2efd4541f4b716dbc3daeee495cae406e8028/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/38e05d296bbde8e9d6b8d402a83746d3e6dddd2774230b287888b47e8a15c0e7/contract';
import endContract from '../../snapshots/38e05d296bbde8e9d6b8d402a83746d3e6dddd2774230b287888b47e8a15c0e7/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'UserGenre',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('genreId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['userId', 'genreId'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'UserGenre',
        index: 'UserGenre_genreId_idx_8fce6a7b',
        columns: ['genreId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'UserGenre',
        index: 'UserGenre_genreId_userId_idx_2c46c206',
        columns: ['genreId', 'userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'UserGenre',
        index: 'UserGenre_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'UserGenre',
        foreignKey: {
          name: 'UserGenre_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'UserGenre',
        foreignKey: {
          name: 'UserGenre_genreId_fkey',
          columns: ['genreId'],
          references: { schema: 'public', table: 'Genre', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
