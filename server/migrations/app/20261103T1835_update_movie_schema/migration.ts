#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/18bcf2796932ab7711e9586762b2efd4541f4b716dbc3daeee495cae406e8028/contract';
import endContract from '../../snapshots/18bcf2796932ab7711e9586762b2efd4541f4b716dbc3daeee495cae406e8028/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/8df94a7592b6c13fb5a20af5ad6389472c5c343ef9d11b9b0e1cd85887b1399c/contract';
import startContract from '../../snapshots/8df94a7592b6c13fb5a20af5ad6389472c5c343ef9d11b9b0e1cd85887b1399c/contract.json' with { type: 'json' };
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
      this.dropConstraint({ schema: 'public', table: 'Genre', constraint: 'Genre_name_key' }),
      this.dropTable({ schema: 'public', table: 'MovieActor' }),
      this.dropTable({ schema: 'public', table: 'Actor' }),
      this.createTable({
        schema: 'public',
        table: 'MovieCharacter',
        columns: [
          col('castOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('characterName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('characterPhotoUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('movieId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addRequiredColumnToEmptyTable({
        schema: 'public',
        table: 'Genre',
        column: 'normalizedName',
        type: 'text',
      }),
      this.addUnique({
        schema: 'public',
        table: 'Genre',
        constraint: 'Genre_normalizedName_key',
        columns: ['normalizedName'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'MovieCharacter',
        index: 'MovieCharacter_movieId_castOrder_idx_ef7a6e6e',
        columns: ['movieId', 'castOrder'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'MovieCharacter',
        index: 'MovieCharacter_movieId_idx_8cb9f9db',
        columns: ['movieId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'MovieCharacter',
        foreignKey: {
          name: 'MovieCharacter_movieId_fkey',
          columns: ['movieId'],
          references: { schema: 'public', table: 'Movie', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
