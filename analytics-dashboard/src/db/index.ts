import 'server-only';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export type Db = NodePgDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { __analyticsDb?: Db };

/** direct connection to the Fossorial API's Postgres (`DATABASE_URL`), read-only use */
export function getDb(): Db {
  if (globalForDb.__analyticsDb) return globalForDb.__analyticsDb;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set (see .env.example)');

  // one pool across dev hot reloads
  globalForDb.__analyticsDb = drizzle(new Pool({ connectionString, max: 5 }), { schema });
  return globalForDb.__analyticsDb;
}

export * from './schema';
