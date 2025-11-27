import { GOOGLE_SHEETS_CREDENTIALS, SPREADSHEET_ID } from '$env/static/private'
import { google, type sheets_v4 } from 'googleapis'
import type { Media, Review, Season, Series, User } from './db/schema'

type TrekSeries = 'TOS' | 'TAS' | 'TNG' | 'DS9' | "V'GER" | 'ENT' | 'DIS' | 'PIC' | 'LWD' | 'SNW'

interface ReviewWithRelations extends Review {
    author: User
    media: Media & {
        season: Season | null
        series: Series
    }
}

// Column mapping for the sheet (0-indexed)
const COLUMNS = {
    SEASON: 0, // A
    EPISODE: 1, // B
    TITLE: 2, // C (assuming you have this)
    HIDDENSUMMARY: 3, // D
    SUMMARY: 4, // E
    JASMINE: 5, // F
    JNOTES: 6, // G
    EMILIANO: 7, // H
    ENOTES: 8, // I
} as const

// Map usernames to their score/notes columns
const USER_COLUMNS: Record<string, { score: number; notes: number }> = {
    jars: { score: COLUMNS.JASMINE, notes: COLUMNS.JNOTES },
    Emiliano: { score: COLUMNS.EMILIANO, notes: COLUMNS.ENOTES },
}

let sheetsClient: sheets_v4.Sheets | null = null

function getSheets(): sheets_v4.Sheets {
    if (!sheetsClient) {
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(GOOGLE_SHEETS_CREDENTIALS),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        })

        sheetsClient = google.sheets({ version: 'v4', auth })
    }
    return sheetsClient
}

/**
 * Find the row number for a specific episode in a sheet
 * Returns the 1-indexed row number (for A1 notation) or null if not found
 */
async function findEpisodeRow(
    sheetName: TrekSeries,
    seasonNum: number | null,
    episodeNum: number
): Promise<number | null> {
    const sheets = getSheets()

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:B`, // Season and Episode columns
    })

    const rows = response.data.values
    if (!rows) return null

    // Start from 1 to skip header row, add 1 for 1-indexed sheets
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i]
        if (!row) continue

        const rowSeason = row[0]?.toString().trim()
        const rowEpisode = row[1]?.toString().trim()

        // Handle movies (Season = 'M')
        if (seasonNum === null && rowSeason === 'M') {
            if (parseInt(rowEpisode, 10) === episodeNum) {
                return i + 1 // Convert to 1-indexed
            }
        } else if (parseInt(rowSeason, 10) === seasonNum) {
            // Handle episodes that might be comma-separated
            const episodes = rowEpisode.split(/\s*,\s*/).map(e => parseInt(e.trim(), 10))
            if (episodes.includes(episodeNum)) {
                return i + 1
            }
        }
    }

    return null
}

/**
 * Convert column index to letter (0 = A, 1 = B, etc.)
 */
function colToLetter(col: number): string {
    return String.fromCharCode(65 + col)
}

/**
 * Sync a single review to Google Sheets
 */
export async function syncReviewToSheet(review: ReviewWithRelations): Promise<void> {
    const sheets = getSheets()
    const { author, media } = review
    const { series, season } = media

    const sheetName = series.acronym as TrekSeries
    const userCols = USER_COLUMNS[author.username]

    if (!userCols) {
        console.warn(`Unknown user ${author.username}, skipping sheet sync`)
        return
    }

    try {
        const rowNum = await findEpisodeRow(sheetName, season?.number ?? null, media.episode)

        if (!rowNum) {
            console.error(`Could not find row for ${sheetName} S${season?.number ?? 'M'} E${media.episode}`)
            return
        }

        // Update score and notes cells
        const scoreCell = `${sheetName}!${colToLetter(userCols.score)}${rowNum}`
        const notesCell = `${sheetName}!${colToLetter(userCols.notes)}${rowNum}`

        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                valueInputOption: 'RAW',
                data: [
                    { range: scoreCell, values: [[review.score]] },
                    { range: notesCell, values: [[review.body]] },
                ],
            },
        })

        console.log(`Synced review to sheet: ${sheetName} row ${rowNum} for ${author.username}`)
    } catch (error) {
        console.error('Failed to sync review to sheet:', error)
        throw error // Re-throw so caller can handle
    }
}

/**
 * Delete/clear a review from Google Sheets
 */
export async function clearReviewFromSheet(review: ReviewWithRelations): Promise<void> {
    const sheets = getSheets()
    const { author, media } = review
    const { series, season } = media

    const sheetName = series.acronym as TrekSeries
    const userCols = USER_COLUMNS[author.username]

    if (!userCols) return

    try {
        const rowNum = await findEpisodeRow(sheetName, season?.number ?? null, media.episode)

        if (!rowNum) return

        const scoreCell = `${sheetName}!${colToLetter(userCols.score)}${rowNum}`
        const notesCell = `${sheetName}!${colToLetter(userCols.notes)}${rowNum}`

        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                valueInputOption: 'RAW',
                data: [
                    { range: scoreCell, values: [['']] },
                    { range: notesCell, values: [['']] },
                ],
            },
        })

        console.log(`Cleared review from sheet: ${sheetName} row ${rowNum} for ${author.username}`)
    } catch (error) {
        console.error('Failed to clear review from sheet:', error)
    }
}

/**
 * Batch sync multiple reviews (more efficient for bulk operations)
 */
export async function batchSyncReviewsToSheet(reviews: ReviewWithRelations[]): Promise<void> {
    const sheets = getSheets()

    // Group updates by sheet for efficiency
    const updateData: sheets_v4.Schema$ValueRange[] = []

    for (const review of reviews) {
        const { author, media } = review
        const { series, season } = media

        const sheetName = series.acronym as TrekSeries
        const userCols = USER_COLUMNS[author.username]

        if (!userCols) continue

        try {
            const rowNum = await findEpisodeRow(sheetName, season?.number ?? null, media.episode)

            if (!rowNum) continue

            updateData.push(
                { range: `${sheetName}!${colToLetter(userCols.score)}${rowNum}`, values: [[review.score]] },
                { range: `${sheetName}!${colToLetter(userCols.notes)}${rowNum}`, values: [[review.body]] }
            )
        } catch (error) {
            console.error(`Failed to prepare sync for review ${review.id}:`, error)
        }
    }

    if (updateData.length === 0) return

    await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
            valueInputOption: 'RAW',
            data: updateData,
        },
    })

    console.log(`Batch synced ${reviews.length} reviews to sheets`)
}
