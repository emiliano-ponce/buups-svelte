/**
 * Occasional sync: Sheet → App
 *
 * This script pulls reviews from Google Sheets and syncs them to the app.
 * App data WINS on conflicts (if a review exists in app, sheet data is ignored).
 *
 * Run manually: npx tsx scripts/sync-from-sheets.ts
 * Or set up as a cron job for periodic sync
 */

import Database from 'better-sqlite3'
import * as dotenv from 'dotenv'
import { and, eq } from 'drizzle-orm'
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { google } from 'googleapis'
import * as schema from '../src/lib/server/db/schema'

dotenv.config({ path: './.env' })

const requiredEnvVars = ['DATABASE_URL', 'GOOGLE_SHEETS_KEY', 'SPREADSHEET_ID']
requiredEnvVars.forEach(val => {
    if (!process.env[val]) throw new Error(`${val} is not set`)
})

type TrekSeries = 'TOS' | 'TAS' | 'TNG' | 'DS9' | "V'GER" | 'ENT' | 'DIS' | 'PIC' | 'LWD' | 'SNW'

interface XLData {
    Season: string
    Episode: string
    Jasmine: string
    Emiliano: string
    JNotes: string
    ENotes: string
}

interface SyncStats {
    sheetsProcessed: number
    rowsProcessed: number
    reviewsCreated: number
    reviewsSkipped: number
    errors: number
}

async function main() {
    const stats: SyncStats = {
        sheetsProcessed: 0,
        rowsProcessed: 0,
        reviewsCreated: 0,
        reviewsSkipped: 0,
        errors: 0,
    }

    try {
        console.info('🔄 Starting Sheet → App sync')
        console.info('   (App data wins on conflicts)\n')

        const client = new Database(process.env.DATABASE_URL)
        client.pragma('journal_mode = WAL')
        const db = drizzle(client, { schema })

        const sheets = google.sheets({ version: 'v4', auth: process.env.GOOGLE_SHEETS_KEY })
        const spreadsheetId = process.env.SPREADSHEET_ID

        // Get user records
        const jUser = await db.query.user.findFirst({
            where: eq(schema.user.username, 'jars'),
        })
        const eUser = await db.query.user.findFirst({
            where: eq(schema.user.username, 'Emiliano'),
        })

        if (!jUser || !eUser) {
            throw new Error('Required users not found in database')
        }

        const spreadsheetData = await sheets.spreadsheets.get({ spreadsheetId })
        if (!spreadsheetData.data.sheets) throw new Error('No sheets found')

        for (const sheet of spreadsheetData.data.sheets) {
            const sheetName = sheet.properties?.title as TrekSeries
            if (!sheetName) continue

            console.log(`\n📋 Processing sheet: ${sheetName}`)

            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A:I`,
            })

            const rows = response.data.values
            if (!rows?.length) {
                console.log('   No data found, skipping')
                continue
            }

            const headers = rows.shift()
            if (!headers) continue

            // Find series
            const seriesResult = await db.query.series.findFirst({
                where: eq(schema.series.acronym, sheetName),
                with: { media: true, seasons: true },
            })

            if (!seriesResult) {
                console.error(`   ❌ Series ${sheetName} not found in DB`)
                stats.errors++
                continue
            }

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i]
                if (!row?.length) continue

                const rowData = {}
                headers.forEach((header, j) => {
                    rowData[header] = j < row.length ? row[j] : ''
                })

                const { Jasmine, Emiliano, ENotes, Episode, JNotes, Season } = rowData as XLData

                // Skip rows without scores
                if (!Jasmine && !Emiliano) continue

                const isMovie = Season === 'M'
                const seasonNum = isMovie ? null : parseInt(Season, 10)
                const episodeStr = Episode?.toString().trim()
                if (!episodeStr) continue

                const episodeNumbers = episodeStr.split(/\s*,\s*/).map(ep => parseInt(ep.trim(), 10))

                for (const episodeNum of episodeNumbers) {
                    if (isNaN(episodeNum)) continue

                    // Find media
                    const season = seriesResult.seasons.find(s => s.number === seasonNum)
                    const media = seriesResult.media.find(
                        m => m.episode === episodeNum && (!season ? m.type === 'movie' : m.seasonId === season.id)
                    )

                    if (!media) {
                        console.warn(`   ⚠️  Media not found: S${seasonNum ?? 'M'} E${episodeNum}`)
                        continue
                    }

                    // Process Jasmine's review
                    if (Jasmine) {
                        const jScore = parseInt(Jasmine, 10)
                        if (!isNaN(jScore)) {
                            const created = await syncReview(db, {
                                authorId: jUser.id,
                                mediaId: media.id,
                                score: jScore,
                                body: JNotes || '',
                            })
                            if (created) stats.reviewsCreated++
                            else stats.reviewsSkipped++
                        }
                    }

                    // Process Emiliano's review
                    if (Emiliano) {
                        const eScore = parseInt(Emiliano, 10)
                        if (!isNaN(eScore)) {
                            const created = await syncReview(db, {
                                authorId: eUser.id,
                                mediaId: media.id,
                                score: eScore,
                                body: ENotes || '',
                            })
                            if (created) stats.reviewsCreated++
                            else stats.reviewsSkipped++
                        }
                    }

                    stats.rowsProcessed++
                }
            }

            stats.sheetsProcessed++
        }

        console.log('\n' + '='.repeat(50))
        console.log('📊 Sync Complete!')
        console.log(`   Sheets processed: ${stats.sheetsProcessed}`)
        console.log(`   Rows processed: ${stats.rowsProcessed}`)
        console.log(`   Reviews created: ${stats.reviewsCreated}`)
        console.log(`   Reviews skipped (already exist): ${stats.reviewsSkipped}`)
        console.log(`   Errors: ${stats.errors}`)
    } catch (error) {
        console.error('\n❌ Sync failed:', error)
        process.exit(1)
    }
}

/**
 * Sync a single review - only creates if doesn't exist (app wins)
 * Returns true if created, false if skipped
 */
async function syncReview(
    db: BetterSQLite3Database<typeof schema> & { $client: Database.Database },
    data: { authorId: string; mediaId: number; score: number; body: string }
): Promise<boolean> {
    // Check if review already exists in app
    const existing = await db.query.review.findFirst({
        where: and(eq(schema.review.authorId, data.authorId), eq(schema.review.mediaId, data.mediaId)),
    })

    // App wins - if review exists, don't overwrite
    if (existing) {
        return false
    }

    // Create new review from sheet
    await db.insert(schema.review).values({
        authorId: data.authorId,
        mediaId: data.mediaId,
        score: data.score,
        body: data.body,
    })

    return true
}

main()
