<script lang="ts">
    import { goto } from '$app/navigation'
    import Button from '$lib/components/Button.svelte'
    import MediaFilters from '$lib/components/MediaFilters.svelte'
    import ReviewList from '$lib/components/ReviewList.svelte'
    import type { PageProps } from './$types'

    let { data }: PageProps = $props()

    let filtersOpen = $state(false)
    let filterRef: MediaFilters

    function applyFilters() {
        const values = filterRef.getValues()
        const params = new URLSearchParams()

        if (values.seriesId) params.set('series', values.seriesId.toString())
        if (values.seasonId) params.set('season', values.seasonId.toString())
        if (values.score) params.set('score', values.score)
        if (values.title?.trim()) params.set('title', values.title.trim())

        goto(`?${params.toString()}`, { keepFocus: true })
    }

    async function clearFilters() {
        await goto('?', { keepFocus: true })
    }

    function toggleFilters() {
        filtersOpen = !filtersOpen
    }

    const hasFilters = $derived(data.filters.series || data.filters.season || data.filters.score || data.filters.title)
</script>

<div class="heading">
    <h2>Welcome, {data.user?.username}</h2>
    <Button onclick={toggleFilters} sound="beep4">{filtersOpen ? 'Hide' : 'Show'} Filters</Button>
</div>

<MediaFilters
    bind:this={filterRef}
    allSeries={data.allSeries}
    initialValues={data.filters}
    showTitle
    showScore
    {filtersOpen}
>
    {#snippet actions()}
        <div class="filter-actions">
            <Button --button-color="var(--red)" onclick={clearFilters} disabled={!hasFilters}>Clear</Button>
            <Button --button-color="var(--blue)" sound="beep1" onclick={applyFilters}>Apply</Button>
        </div>
    {/snippet}
</MediaFilters>

<ReviewList reviews={data.reviews} />

<style>
    .heading {
        display: flex;
        justify-content: space-between;
        max-width: var(--max-width);
        margin: 0 auto;
    }
    .filter-actions {
        display: flex;
        gap: 0.5rem;
        align-items: flex-end;
        margin-left: auto;
    }
</style>
