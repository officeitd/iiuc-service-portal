import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

declare global {
  var __iiucPool: Pool | undefined;
}

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set.');
  }

  globalThis.__iiucPool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  return globalThis.__iiucPool;
}

export function db() {
  return drizzle(getPool(), { schema });
}
