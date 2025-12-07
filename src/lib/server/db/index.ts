// src/lib/server/db/index.ts
import { env } from '$env/dynamic/private'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

const isProduction = process.env.NODE_ENV === 'production'
const DB_URL = env.DATABASE_URL ?? process.env.DATABASE_URL

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDb() {
    if (!DB_URL) throw new Error('DATABASE_URL is not set')
    if (!_db) {
        if (isProduction) {
            if (!env.DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not set')
            const client = createClient({ url: DB_URL, authToken: env.DATABASE_AUTH_TOKEN })
            _db = drizzle(client, { schema })
        } else {
            const client = createClient({ url: `file:${DB_URL}` })
            _db = drizzle(client, { schema })
        }
    }
    return _db
}
