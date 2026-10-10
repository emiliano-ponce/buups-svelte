import { createClient } from '@libsql/client'
import 'dotenv/config'
import { readMigrationFiles } from 'drizzle-orm/migrator'
import { fileURLToPath } from 'node:url'

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is not set')

const client = createClient({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,
})

const migrations = readMigrationFiles({
    migrationsFolder: fileURLToPath(new URL('../drizzle', import.meta.url)),
})

async function migrate() {
    await client.execute(`
        CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
            id SERIAL PRIMARY KEY,
            hash text NOT NULL,
            created_at numeric
        )
    `)

    const transaction = await client.transaction('write')

    try {
        const applied = await transaction.execute(
            'SELECT created_at FROM "__drizzle_migrations" ORDER BY created_at DESC LIMIT 1',
        )
        const latestMigration = applied.rows[0]?.created_at
        let appliedCount = 0

        for (const migration of migrations) {
            if (latestMigration !== undefined && Number(latestMigration) >= migration.folderMillis) continue

            for (const statement of migration.sql) {
                const createObject = statement.match(
                    /^\s*CREATE\s+(?:UNIQUE\s+)?(TABLE|INDEX)\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:"([^"]+)"|`([^`]+)`|\[([^\]]+)\]|([\w]+))/i,
                )

                if (createObject) {
                    const objectType = createObject[1].toLowerCase()
                    const objectName = createObject[2] ?? createObject[3] ?? createObject[4] ?? createObject[5]
                    const existing = await transaction.execute({
                        sql: 'SELECT 1 FROM sqlite_master WHERE type = ? AND name = ? LIMIT 1',
                        args: [objectType, objectName],
                    })
                    if (existing.rows.length > 0) continue
                }

                const addColumn = statement.match(
                    /^\s*ALTER\s+TABLE\s+(?:"([^"]+)"|`([^`]+)`|([\w]+))\s+ADD(?:\s+COLUMN)?\s+(?:"([^"]+)"|`([^`]+)`|([\w]+))/i,
                )

                if (addColumn) {
                    const table = addColumn[1] ?? addColumn[2] ?? addColumn[3]
                    const column = addColumn[4] ?? addColumn[5] ?? addColumn[6]
                    const columns = await transaction.execute(`PRAGMA table_info("${table}")`)
                    if (columns.rows.some((row) => row.name === column)) continue
                }

                if (statement.trim()) await transaction.execute(statement)
            }

            await transaction.execute({
                sql: 'INSERT INTO "__drizzle_migrations" ("hash", "created_at") VALUES (?, ?)',
                args: [migration.hash, migration.folderMillis],
            })
            appliedCount += 1
        }

        await transaction.commit()
        console.log(appliedCount ? `Applied ${appliedCount} migration(s).` : 'No pending migrations.')
    } catch (error) {
        await transaction.rollback()
        throw error
    } finally {
        client.close()
    }
}

await migrate()