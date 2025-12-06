import { env } from '$env/dynamic/private';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!_db) {
    if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
    const client = new Database(env.DATABASE_URL);
    _db = drizzle<typeof schema>(client, { schema });
  }
  return _db;
}
