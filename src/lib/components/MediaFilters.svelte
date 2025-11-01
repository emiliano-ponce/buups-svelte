<script lang="ts">
    import type { Media, Season, Series } from '$lib/server/db/schema'
    import type { Snippet } from 'svelte'
    import { slide } from 'svelte/transition'

    export interface FilterValues {
        seriesId: string
        seasonId: string
        mediaId: string
        score: string
        title: string
    }

    interface MediaFiltersProps {
        allSeries: Series[]
        initialValues?: Partial<FilterValues>
        showTitle?: boolean
        showScore?: boolean
        showEpisode?: boolean
        filtersOpen?: boolean
        onChange?: (values: FilterValues) => void
        actions?: Snippet
    }

    const {
        allSeries,
        initialValues = {},
        showTitle = false,
        showScore = false,
        showEpisode = false,
        filtersOpen = false,
        onChange,
        actions,
    }: MediaFiltersProps = $props()

    const scoreOptions = [
        { value: '1', label: '>=1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
        { value: '7', label: '7' },
        { value: '8', label: '8' },
        { value: '9', label: '9' },
        { value: '10', label: '10+' },
    ]

    let seriesId = $state<string>(initialValues.seriesId ?? '')
    let seasonId = $state<string>(initialValues.seasonId ?? '')
    let mediaId = $state<string>(initialValues.mediaId ?? '')
    let minScore = $state<string>(initialValues.score ?? '')
    let titleQuery = $state<string>(initialValues.title ?? '')

    let availableSeasons = $state<Season[]>([])
    let availableMedia = $state<Media[]>([])
    let loadingSeasons = $state(false)
    let loadingMedia = $state(false)

    let titleDebounceTimeout: ReturnType<typeof setTimeout> | null = null

    $effect(() => {
        if (seriesId) {
            fetchSeasons(seriesId)
        } else {
            availableSeasons = []
            availableMedia = []
        }
    })

    $effect(() => {
        if (seriesId && seasonId) {
            fetchMedia(seriesId, seasonId)
        } else {
            availableMedia = []
        }
    })

    async function fetchSeasons(seriesIdValue: string) {
        loadingSeasons = true
        try {
            const res = await fetch(`/api/seasons?seriesId=${seriesIdValue}`)
            availableSeasons = await res.json()
        } catch (err) {
            console.error('Failed to fetch seasons:', err)
            availableSeasons = []
        } finally {
            loadingSeasons = false
        }
    }

    async function fetchMedia(seriesIdValue: string, seasonIdValue: string) {
        loadingMedia = true
        try {
            let url = `/api/media?seriesId=${seriesIdValue}`
            if (seasonIdValue) {
                url += `&seasonId=${seasonIdValue}`
            }
            const res = await fetch(url)
            availableMedia = await res.json()
        } catch (err) {
            console.error('Failed to fetch media:', err)
            availableMedia = []
        } finally {
            loadingMedia = false
        }
    }

    function notifyChange() {
        onChange?.({
            seriesId,
            seasonId,
            mediaId,
            score: minScore,
            title: titleQuery,
        })
    }

    function handleSeriesChange(value: string) {
        seriesId = value
        seasonId = ''
        mediaId = ''
        notifyChange()
    }

    function handleSeasonChange(value: string) {
        value === 'movie' ? (seasonId = '') : (seasonId = value)
        mediaId = ''
        notifyChange()
    }

    function handleMediaChange(value: string) {
        mediaId = value
        notifyChange()
    }

    function handleScoreChange(value: string) {
        minScore = value
        notifyChange()
    }

    function handleTitleInput(value: string) {
        titleQuery = value

        if (titleDebounceTimeout) {
            clearTimeout(titleDebounceTimeout)
        }
        titleDebounceTimeout = setTimeout(() => {
            notifyChange()
        }, 120)
    }

    export function getValues(): FilterValues {
        return {
            seriesId,
            seasonId,
            mediaId,
            score: minScore,
            title: titleQuery,
        }
    }
</script>

{#if filtersOpen}
    <div transition:slide class="filters-wrapper">
        <div class="filters">
            <div class="filter-group">
                <label for="series">Series</label>
                <select id="series" bind:value={() => seriesId, handleSeriesChange}>
                    <option value="">All</option>
                    {#each allSeries as series}
                        <option value={`${series.id}`}>{series.title} ({series.acronym})</option>
                    {/each}
                </select>
            </div>

            <div class="filter-group">
                <label for="season-filter">Season</label>
                <select 
                    id="season-filter" 
                    bind:value={() => seasonId, handleSeasonChange} 
                    disabled={!seriesId || loadingSeasons}
                >
                    <option value="">All</option>
                    {#if loadingSeasons}
                        <option disabled>Loading...</option>
                    {:else}
                        {#each availableSeasons as season}
                            <option value={`${season.id}`}>Season {season.number}</option>
                        {/each}
                        <option value="movie">Movies</option>
                    {/if}
                </select>
            </div>

            {#if showEpisode}
                <div class="filter-group">
                    <label for="media-filter">
                        {seasonId ? 'Episode' : 'Movie'}
                    </label>
                    <select 
                        id="media-filter" 
                        bind:value={() => mediaId, handleMediaChange} 
                        disabled={!seriesId || loadingMedia}
                    >
                        <option value="">All</option>
                        {#if loadingMedia}
                            <option disabled>Loading...</option>
                        {:else}
                            {#each availableMedia as m}
                                <option value={`${m.id}`}>
                                    {#if m.type === 'episode'}
                                        {m.episode}
                                    {:else}
                                        {m.title}
                                    {/if}
                                </option>
                            {/each}
                        {/if}
                    </select>
                </div>
            {/if}

            {#if showScore}
                <div class="filter-group">
                    <label for="score-filter">Score</label>
                    <select id="score-filter" bind:value={() => minScore, handleScoreChange}>
                        <option value="">All</option>
                        {#each scoreOptions as option}
                            <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                </div>
            {/if}

            {#if showTitle}
                <div class="filter-group">
                    <label for="title-filter">Title Search</label>
                    <input
                        type="text"
                        id="title-filter"
                        placeholder="Search by title..."
                        bind:value={() => titleQuery, handleTitleInput}
                    />
                </div>
            {/if}
        </div>

        {@render actions?.()}
    </div>
{/if}

<style>
    .filters-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .filters {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 100px;
    }

    .filter-group label {
        font-weight: 600;
        font-size: 0.875rem;
    }

    .filter-group select,
    .filter-group input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
    }

    .filter-group select::placeholder,
    .filter-group input::placeholder {
        color: var(--text-color);
    }

    .filter-group select:disabled,
    .filter-group input:disabled {
        opacity: 0.5;
    }

    #series {
        width: 150px;
    }
</style>
