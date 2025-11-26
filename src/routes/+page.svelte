<script lang="ts">
    import { goto } from '$app/navigation'
    import { page } from '$app/stores'
    import Button from '$lib/components/Button.svelte'
    import MediaFilters from '$lib/components/MediaFilters.svelte'
    import ReviewList from '$lib/components/ReviewList.svelte'
    import { onMount } from 'svelte'
    import type { PageProps } from './$types'
    import type { GetReviewsResponse, GroupedReviews } from './api/reviews/+server'

    let { data }: PageProps = $props()

    let filtersOpen = $state(false)
    let filterRef: MediaFilters
    let allReviews = $state<GroupedReviews>([])
    let loading = $state(false)
    let initialLoading = $state(true)
    let hasMore = $state(true)
    let currentPage = $state(1)
    let observer: IntersectionObserver | null = null
    let loadMoreTrigger: HTMLElement | null = $state(null)

    let currentFilters = $state('')

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

    async function loadReviews(pageNum: number, append = false) {
        if (loading) return

        loading = true

        try {
            const params = new URLSearchParams($page.url.searchParams)
            params.set('page', pageNum.toString())

            const response = await fetch(`/api/reviews?${params.toString()}`)

            if (!response.ok) {
                throw new Error('Failed to load reviews')
            }

            const result = (await response.json()) as GetReviewsResponse

            if (append) {
                allReviews = [...allReviews, ...result.reviews]
            } else {
                allReviews = result.reviews
            }

            hasMore = result.hasMore
            currentPage = result.currentPage
        } catch (error) {
            console.error('Error loading reviews:', error)
        } finally {
            loading = false
            initialLoading = false
        }
    }

    async function loadMore() {
        if (!hasMore || loading) return
        await loadReviews(currentPage + 1, true)
    }

    $effect(() => {
        const newFilters = $page.url.searchParams.toString()

        if (newFilters !== currentFilters) {
            currentFilters = newFilters
            currentPage = 1
            hasMore = true
            initialLoading = true
            loadReviews(1, false)
        }
    })

    onMount(() => {
        currentFilters = $page.url.searchParams.toString()
        loadReviews(1, false)

        observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading && !initialLoading) {
                    loadMore()
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px',
            }
        )

        return () => {
            if (observer) {
                observer.disconnect()
            }
        }
    })

    $effect(() => {
        if (observer && loadMoreTrigger) {
            observer.observe(loadMoreTrigger)
        }
    })

    const hasFilters = $derived(data.filters.series || data.filters.season || data.filters.score || data.filters.title)
</script>

<div class="heading">
    <h2>Welcome, {data.user?.username}</h2>
    <Button onclick={toggleFilters} sound="beep4">
        {filtersOpen ? 'Hide' : 'Show'} Filters
    </Button>
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

{#if initialLoading}
    <div class="loading-initial">
        <p>Loading reviews...</p>
    </div>
{:else if allReviews.length === 0}
    <div class="no-reviews">
        <p>No reviews found.</p>
    </div>
{:else}
    <ReviewList reviews={allReviews} />

    {#if hasMore}
        <div bind:this={loadMoreTrigger} class="load-more-trigger">
            {#if loading}
                <div class="loading-more">
                    <p>Loading more reviews...</p>
                </div>
            {/if}
        </div>
    {/if}
{/if}

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
