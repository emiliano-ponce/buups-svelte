<script lang="ts">
    import { goto } from '$app/navigation'
    import Button from '$lib/components/Button.svelte'
    import ReviewList from '$lib/components/ReviewList.svelte'
    import type { PageProps } from './$types'

    let { data }: PageProps = $props()

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

    let seriesId = $state(data.filters.series || '')
    let seasonId = $state(data.filters.season || '')
    let minScore = $state(data.filters.score || '')
    let titleQuery = $state(data.filters.title || '')

    // Reset season when series changes
    $effect(() => {
        if (seriesId !== data.filters.series) {
            seasonId = ''
        }
    })

    function applyFilters() {
        const params = new URLSearchParams()

        if (seriesId) params.set('series', seriesId)
        if (seasonId && seriesId) params.set('season', seasonId)
        if (minScore) params.set('score', minScore)
        if (titleQuery.trim()) params.set('title', titleQuery.trim())

        goto(`?${params.toString()}`, { keepFocus: true })
    }

    function clearFilters() {
        seriesId = ''
        seasonId = ''
        minScore = ''
        titleQuery = ''
        goto('?', { keepFocus: true })
    }

    const hasFilters = $derived(Object.values(data.filters).some(value => value))
</script>

<h2>Welcome, {data.user?.username}</h2>

<div class="filters-wrapper">
    <div class="filters">
        <div class="filter-group">
            <label for="series">Series</label>
            <select id="series" bind:value={seriesId} onchange={applyFilters}>
                <option value="">All</option>
                {#each data.allSeries as series}
                    <option value={`${series.id}`}>{series.title} ({series.acronym})</option>
                {/each}
            </select>
        </div>

        <div class="filter-group">
            <label for="season">Season</label>
            <select id="season" bind:value={seasonId} onchange={applyFilters}>
                <option value="">All</option>
                {#each data.availableSeasons as season}
                    <option value={`${season.id}`}>{season.number}</option>
                {/each}
                <option value="movie">Movies</option>
            </select>
        </div>

        <div class="filter-group">
            <label for="score">Score</label>
            <select id="score" bind:value={minScore} onchange={applyFilters}>
                <option value="">All</option>
                {#each scoreOptions as option}
                    <option value={option.value}>{option.label}</option>
                {/each}
            </select>
        </div>

        <div class="filter-group">
            <label for="title">Title Search</label>
            <input
                type="text"
                id="title"
                bind:value={titleQuery}
                placeholder="Search by title..."
                onkeydown={e => e.key === 'Enter' && applyFilters()}
            />
        </div>
    </div>

    <div class="filter-actions">
        <Button --button-color="var(--blue)" onclick={applyFilters}>Apply</Button>
        <Button --button-color="var(--red)" onclick={clearFilters} disabled={!hasFilters}>Clear</Button>
    </div>
</div>

<ReviewList reviews={data.reviews} />

<style>
    .filters-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin: 1rem auto;
        max-width: 1440px;
    }

    .filters {
        display: flex;
        gap: 1rem;
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
        &::placeholder {
            color: var(--text-color);
        }
        &:disabled {
            opacity: 0.5;
        }
    }

    #series {
        width: 150px;
    }

    .filter-actions {
        display: flex;
        gap: 0.5rem;
        align-items: flex-end;
        margin-left: auto;
    }
</style>
