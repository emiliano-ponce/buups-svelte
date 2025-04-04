import Database from 'better-sqlite3'
import * as dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from '../src/lib/server/db/schema'
import { TMDBIds } from '../src/lib/utils/tmdbData'

dotenv.config()
const requiredEnvVars = ['DATABASE_URL', 'TMDB_API_KEY']
console.log('db url', process.env.DATABASE_URL)
requiredEnvVars.forEach(val => {
    if (!process.env[val]) throw new Error(`${val} is not set`)
})

async function main() {
    try {
        console.info('Creating DB client')
        const client = new Database(process.env.DATABASE_URL)
        const db = drizzle<typeof schema>(client, { schema })
        console.info('DB Client created!')

        // Fetch & insert series, seasons, episodes, and movies
        console.info('Getting series from TMDB')
        const trekMediaMap = await getTrekMedia()

        console.info('Inserting trek media into DB')
        const trekMediaEntries = Object.entries(trekMediaMap)
        for (const entry of trekMediaEntries) {
            const [acronym, data] = entry as [TrekSeries, TrekSeriesData]
            const { series, seasons, movies } = data

            // Insert series
            const [seriesRecord] = await db.insert(schema.series).values(makeSeries(series, acronym)).returning()
            const { id: seriesId } = seriesRecord

            // Insert seasons
            for (const season of seasons) {
                const [seasonRecord] = await db
                    .insert(schema.season)
                    .values({ ...makeSeason(season), seriesId })
                    .returning()
                const { id: seasonId } = seasonRecord

                // Insert episodes from seasons
                const epsToInsert = season.episodes.filter(ep => ep.air_date).map(ep => ({ ...makeEpisode(ep), seriesId, seasonId }))
                await db.insert(schema.media).values(epsToInsert).returning()
            }

            // Insert movies
            let movieNum = 1
            for (const m of movies) {
                await db.insert(schema.media).values({ ...makeMovie(m, movieNum), seriesId })
                movieNum++
            }
        }
    } catch (error) {
        console.error(error)
    }
}

main()

const baseImageUrl = 'https://image.tmdb.org/t/p/original'
const makeImgUrl = (path: string) => `${baseImageUrl}${path}`
const makeSeries = (tmdbSeries: TMDBSeries, acronym: TrekSeries): Omit<schema.Series, 'id'> => {
    const { name, overview, poster_path, vote_average, vote_count } = tmdbSeries
    return {
        acronym,
        imageUrl: makeImgUrl(poster_path),
        overview,
        title: name,
        tmdbStats: {
            voteAvg: vote_average,
            voteCount: vote_count,
        },
    }
}
const makeSeason = (tmdbSeason: TMDBSeason): Omit<schema.Season, 'id' | 'seriesId'> => {
    const { name, overview, poster_path, season_number, vote_average, vote_count } = tmdbSeason
    return {
        number: season_number,
        overview,
        title: name,
        tmdbStats: {
            voteAvg: vote_average,
            voteCount: vote_count,
        },
        imageUrl: makeImgUrl(poster_path),
    }
}
const makeEpisode = (tmdbEp: TMDBEpisode): Omit<schema.Media, 'id' | 'seriesId' | 'seasonId' | 'createDt'> => {
    const { air_date, episode_number, name, overview, still_path, vote_average, vote_count } = tmdbEp
    return {
        date: air_date,
        episode: episode_number,
        overview,
        title: name,
        tmdbStats: {
            voteAvg: vote_average,
            voteCount: vote_count,
        },
        type: 'episode',
        imageUrl: makeImgUrl(still_path),
    }
}
const makeMovie = (tmdbMovie: TMDBMovie, movieNum: number): Omit<schema.Media, 'id' | 'seriesId' | 'seasonId' | 'createDt'> => {
    const { overview, poster_path, release_date, title, vote_average, vote_count } = tmdbMovie
    return {
        date: release_date,
        imageUrl: makeImgUrl(poster_path),
        overview,
        title,
        type: 'movie',
        tmdbStats: {
            voteAvg: vote_average,
            voteCount: vote_count,
        },
        episode: movieNum,
    }
}

async function getTrekMedia(): Promise<TrekSeriesMap> {
    const baseUrl = 'https://api.themoviedb.org/3/tv'
    const apiKeyParam = `api_key=${process.env.TMDB_API_KEY}`
    const getMovieUrl = (movieId: number) => `https://api.themoviedb.org/3/movie/${movieId}?${apiKeyParam}`

    // Initialize the result object
    const result = {} as TrekSeriesMap

    // Process each series sequentially
    for (const [seriesEnum, data] of Object.entries(TMDBIds) as [TrekSeries, TMDBIds][]) {
        const { seriesId, movieIds } = data
        try {
            console.info(`Fetching series data: ${seriesId} ${seriesEnum}`)

            const seriesUrl = `${baseUrl}/${seriesId}`
            const getSeasonUrl = (seasonNum: number) => `${seriesUrl}/season/${seasonNum}?${apiKeyParam}`

            const series = (await fetch(`${seriesUrl}?${apiKeyParam}`).then(r => r.json())) as TMDBSeries

            result[seriesEnum] = {
                series,
                seasons: [],
                movies: [],
            }
            const current: TrekSeriesData = result[seriesEnum]

            // Handle Seasons
            // Fetch all seasons sequentially
            for (let seasonNum = 1; seasonNum <= series.number_of_seasons; seasonNum++) {
                console.info(`Fetching season data: ${seriesEnum} Season: ${seasonNum}`)
                let pilot: TMDBEpisode | undefined
                if (seasonNum === 1 && seriesEnum === 'TOS') {
                    // get pilot from season 0 and add to season 1 episodes
                    const pilotSeason = (await fetch(getSeasonUrl(0)).then(r => r.json())) as TMDBSeason
                    pilot = pilotSeason.episodes[0]
                }
                const season = (await fetch(getSeasonUrl(seasonNum)).then(r => r.json())) as TMDBSeason
                if (pilot) {
                    const correctedSeason = { ...season, episodes: [{...pilot, episode_number: 0 }, ...season.episodes] }
                    current.seasons.push(correctedSeason)
                } else {
                    // only add seasons with air dates
                    if (season.air_date) current.seasons.push(season)
                }
            }

            // Handle Movies - using Promise.all for parallel fetching
            const moviePromises = movieIds.map(async (id, i) => {
                console.info(`Fetching movie data: ${seriesEnum} Movie: ${i + 1}`)
                return (await fetch(getMovieUrl(id)).then(r => r.json())) as TMDBMovie
            })

            current.movies = await Promise.all(moviePromises)
        } catch (err) {
            console.error(err)
        }
    }

    return result
}
