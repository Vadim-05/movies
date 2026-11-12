#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/8df94a7592b6c13fb5a20af5ad6389472c5c343ef9d11b9b0e1cd85887b1399c/contract';
import endContract from '../../snapshots/8df94a7592b6c13fb5a20af5ad6389472c5c343ef9d11b9b0e1cd85887b1399c/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/e4e4777cb17014edca13729f49d945cc0c7db694a362b97e2357333ce1b57f9f/contract';
import startContract from '../../snapshots/e4e4777cb17014edca13729f49d945cc0c7db694a362b97e2357333ce1b57f9f/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
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
        table: 'UsedRefreshToken',
        constraint: 'UsedRefreshToken_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AuthSession',
        index: 'AuthSession_absoluteExpiresAt_idx_1b08abe9',
        columns: ['absoluteExpiresAt'],
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
