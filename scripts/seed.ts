import { hashPassword } from '$lib/server/password'
import Database from 'better-sqlite3'
import * as dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { google } from 'googleapis'
import * as schema from '../src/lib/server/db/schema'

dotenv.config({ path: './.env' })
const requiredEnvVars = ['DATABASE_URL', 'GOOGLE_SHEETS_KEY']
requiredEnvVars.forEach(val => {
    if (!process.env[val]) throw new Error(`${val} is not set`)
})

async function main() {
    try {
        console.info('Creating DB client')
        const client = new Database(process.env.DATABASE_URL)
        // Enable WAL mode for better performance and transaction support
        client.pragma('journal_mode = WAL')
        const db = drizzle<typeof schema>(client, { schema })
        console.info('DB Client created!')

        console.info('Importing reviews from Google Sheets')
        const sheets = google.sheets({ version: 'v4', auth: process.env.GOOGLE_SHEETS_KEY })
        const spreadsheetId = process.env.SPREADSHEET_ID
        const spreadsheetData = await sheets.spreadsheets.get({
            spreadsheetId,
        })

        if (!spreadsheetData.data.sheets) throw new Error('No sheets found in spreadsheet')

        // Begin true transaction
        await client.exec('BEGIN TRANSACTION')

        try {
            const testPassword = await hashPassword('test')
            // Get or create users with better handling for duplicates
            let jUser = await getOrCreateUser(db, {
                username: 'jars',
                email: 'jrae.seitz@gmail.com',
                passwordHash: testPassword,
            })

            let eUser = await getOrCreateUser(db, {
                username: 'Emiliano',
                email: 'wumbo10@proton.me',
                passwordHash: testPassword,
            })

            let trekDate = new Date('2020-11-04T00:00:00') // November 4, 2020 - official star trek night day
            const getNextWeek = date => {
                const result = new Date(date)
                result.setDate(result.getDate() + 7)
                return result
            }

            for (const sheet of spreadsheetData.data.sheets) {
                if (!sheet.properties) throw new Error('No properties found in sheet')
                const sheetName = sheet.properties.title as TrekSeries
                const response = await sheets.spreadsheets.values.get({
                    spreadsheetId,
                    range: `${sheetName}!A:I`,
                })

                const rows = response.data.values
                if (!rows || rows.length === 0) {
                    console.warn(`No rows found in sheet ${sheetName}, skipping`)
                    continue
                }

                const headers = rows.shift()
                if (!headers) {
                    console.warn(`No headers found in sheet ${sheetName}, skipping`)
                    continue
                }

                console.log(`Transforming data from sheet ${sheetName}:`)
                let rowsProcessed = 0

                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i]
                    if (!row || row.length === 0) {
                        console.warn(`Empty row at index ${i} in sheet ${sheetName}, skipping`)
                        continue
                    }

                    const rowData = {}
                    headers.forEach((header, j) => {
                        rowData[header] = j < row.length ? row[j] : ''
                    })

                    const { Jasmine, Emiliano, ENotes, Episode, JNotes, Season } = rowData as XLData

                    // Skip rows without both scores
                    if (!Jasmine || !Emiliano) {
                        console.log(`Skipping row ${i + 1}: Missing review scores`)
                        continue
                    }

                    // Safer number conversions with validation
                    const isMovie = Season === 'M'
                    let seasonNum, jScore, eScore
                    const episodeStr = Episode.toString().trim()
                    const episodeNumbers = episodeStr.split(/\s*,\s*/).map(ep => ep.trim())

                    try {
                        if (!isMovie && Season) {
                            seasonNum = parseInt(Season, 10)
                            if (isNaN(seasonNum)) throw new Error(`Invalid season number: ${Season}`)
                        }

                        jScore = parseInt(Jasmine, 10)
                        if (isNaN(jScore)) throw new Error(`Invalid Jasmine score: ${Jasmine}`)

                        eScore = parseInt(Emiliano, 10)
                        if (isNaN(eScore)) throw new Error(`Invalid Emiliano score: ${Emiliano}`)
                    } catch (error: any) {
                        console.error(`Error processing row ${i + 1} in sheet ${sheetName}:`, error.message)
                        continue // Skip this row instead of failing the whole transaction
                    }

                    try {
                        // Find series
                        const seriesResult = await db.query.series.findFirst({
                            columns: { id: true },
                            where: (series, { eq }) => eq(series.acronym, sheetName),
                            with: {
                                media: true,
                                seasons: true,
                            },
                        })

                        if (!seriesResult) {
                            console.error(`Series ${sheetName} not found, skipping row ${i + 1}`)
                            continue
                        }

                        for (const epString of episodeNumbers) {
                            try {
                                const episodeNum = parseInt(epString, 10)
                                if (isNaN(episodeNum)) {
                                    console.error(`Invalid episode number: ${epString} in row ${i + 1}`)
                                    continue // Skip this episode but continue with others
                                }

                                // Find media
                                const season = seriesResult.seasons.find(s => s.number === seasonNum)
                                const media = seriesResult.media.find(
                                    m =>
                                        m.episode === episodeNum &&
                                        (!season ? m.type === 'movie' : m.seasonId === season.id)
                                )

                                if (!media) {
                                    console.error(
                                        `Media not found for ${sheetName} S:${seasonNum || 'N/A'} E:${episodeNum}, skipping row ${i + 1}`
                                    )
                                    continue
                                }

                                const mediaId = media.id

                                // Check for existing reviews to avoid duplicates
                                const existingJReview = await checkExistingReview(db, jUser.id, mediaId)
                                const existingEReview = await checkExistingReview(db, eUser.id, mediaId)

                                if (!existingJReview) {
                                    await db.insert(schema.review).values({
                                        body: JNotes || '',
                                        authorId: jUser.id,
                                        mediaId,
                                        score: jScore,
                                        createDt: new Date(trekDate),
                                    })
                                } else {
                                    console.log(
                                        `Skipping duplicate review for Jasmine on ${sheetName} S:${seasonNum || 'N/A'} E:${episodeNum}`
                                    )
                                }

                                if (!existingEReview) {
                                    await db.insert(schema.review).values({
                                        body: ENotes || '',
                                        authorId: eUser.id,
                                        mediaId,
                                        score: eScore,
                                        createDt: new Date(trekDate),
                                    })
                                } else {
                                    console.log(
                                        `Skipping duplicate review for Emiliano on ${sheetName} S:${seasonNum || 'N/A'} E:${episodeNum}`
                                    )
                                }
                            } catch (error: any) {
                                console.error(
                                    `Error processing episode ${epString} in row ${i + 1} in sheet ${sheetName}:`,
                                    error.message
                                )
                                continue // Skip this episode but continue with others
                            }
                        }

                        rowsProcessed++

                        // Get next week every 2 rows, only if we actually processed the row
                        if (i % 2 === 0) {
                            trekDate = getNextWeek(trekDate)
                        }
                    } catch (error: any) {
                        console.error(`Error inserting reviews for row ${i + 1} in sheet ${sheetName}:`, error.message)
                        continue // Skip this row instead of failing the whole transaction
                    }
                }

                console.log(`Processed ${rowsProcessed} rows from sheet ${sheetName}`)
            }

            // Commit the transaction if everything succeeded
            await client.exec('COMMIT')
            console.log('Import completed successfully')
        } catch (error) {
            // Roll back the transaction on error
            await client.exec('ROLLBACK')
            console.error('Transaction rolled back due to error:', error)
            throw error // Re-throw for the outer catch block
        }
    } catch (error) {
        console.error('Import failed:', error)
        process.exit(1)
    } finally {
        console.log('Script finished')
    }
}

// Helper function to get existing user or create a new one
async function getOrCreateUser(db, userData) {
    // Try to find existing user by email
    const existingUser = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.email, userData.email),
    })

    if (existingUser) {
        console.log(`User ${userData.email} already exists, using existing record`)
        return existingUser
    }

    // Create new user if not found
    const [newUser] = await db.insert(schema.user).values(userData).returning()

    console.log(`Created new user: ${userData.email}`)
    return newUser
}

// Helper function to check if a review already exists
async function checkExistingReview(db, authorId, mediaId) {
    const existingReview = await db.query.review.findFirst({
        where: (review, { eq, and }) => and(eq(review.authorId, authorId), eq(review.mediaId, mediaId)),
    })

    return existingReview
}

main()
