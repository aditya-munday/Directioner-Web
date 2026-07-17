import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

/**
 * Graceful degradation: when DATABASE_URL is absent (local dev without a DB),
 * export stub instances that throw meaningful errors on first use rather than
 * crashing the process at module import time.
 *
 * In production the env validation in api-server/src/lib/env.ts already
 * ensures DATABASE_URL is present before we reach this code.
 */

type Schema = typeof schema;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _pool: pg.Pool;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _db: NodePgDatabase<Schema>;

if (process.env.DATABASE_URL) {
  _pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
  _db = drizzle(_pool, { schema });
} else {
  const noDb = () => {
    throw new Error(
      "DATABASE_URL is not set. Set it in your Replit secrets to enable database access.",
    );
  };
  // Minimal stub that throws on query — satisfies TypeScript types via cast
  _pool = { query: noDb, end: async () => {} } as unknown as pg.Pool;
  _db   = new Proxy({} as NodePgDatabase<Schema>, {
    get(_t, prop) {
      if (prop === "then") return undefined; // not a Promise
      return noDb;
    },
  });
}

export const pool = _pool;
export const db   = _db;

export * from "./schema";
