interface XLData {
    Season: string
    Episode: string
    Title: string
    Summary: string
    Jasmine: string
    JNotes: string
    Emiliano: string
    ENotes: string
}

type TrekSeries = 'TOS' | 'TAS' | 'TNG' | 'DS9' | 'VOY' | 'ENT' | 'DIS' | 'PIC' | 'LWD' | 'SNW'

type TrekSeriesData = { series: TMDBSeries; seasons: TMDBSeason[]; movies: TMDBMovie[] }
type TrekSeriesMap = Record<TrekSeries, TrekSeriesData>

interface TMDBIds {
    seriesId: number
    movieIds: number[]
}

// TMDB API Types
interface TMDBData {
    overview: string
    vote_average: number
    vote_count: number
}
interface TMDBSeries extends TMDBData {
    name: string
    number_of_seasons: number
    poster_path: string
}
interface TMDBSeason extends TMDBData {
    name: string
    episodes: TMDBEpisode[]
    poster_path: string
    season_number: number
    air_date: string
}
interface TMDBEpisode extends TMDBData {
    episode_number: number
    name: string
    still_path: string // image path
    air_date: string
}
interface TMDBMovie extends TMDBData {
    title: string
    poster_path: string // image path
    release_date: string
}
