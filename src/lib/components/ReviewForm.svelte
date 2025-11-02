<script lang="ts">
    import { enhance } from '$app/forms'
    import type { Media, Series } from '$lib/server/db/schema'
    import Button from './Button.svelte'
    import ContentCard from './ContentCard.svelte'
    import MediaFilters, { type FilterValues } from './MediaFilters.svelte'

    interface ReviewFormProps {
        media: Media | null
        user: { id: string; username: string } | null
        allSeries: Series[]
    }

    const { media, user, allSeries }: ReviewFormProps = $props()

    let selectedSeriesId = $state<number | null>(media?.seriesId ?? null)
    let selectedSeasonId = $state<number | null>(media?.seasonId ?? null)
    let selectedMediaId = $state<number | null>(media?.id ?? null)
    let currentMedia = $state<Media | null>(media)

    function handleFilterChange(values: FilterValues) {
        selectedSeriesId = values.seriesId ? parseInt(values.seriesId) : null
        selectedSeasonId = values.seasonId ? parseInt(values.seasonId) : null
        selectedMediaId = values.mediaId ? parseInt(values.mediaId) : null

        if (selectedMediaId) {
            fetchMediaDetails(selectedMediaId)
        } else {
            currentMedia = null
        }
    }

    async function fetchMediaDetails(mediaId: number) {
        try {
            const res = await fetch(`/api/media/${mediaId}`)
            currentMedia = await res.json()
        } catch (err) {
            console.error('Failed to fetch media details:', err)
            currentMedia = null
        }
    }
</script>

{#if !user}
    <div class="form-wrapper">
        <ContentCard variant="sides">
            <p>Please log in to submit reviews.</p>
        </ContentCard>
    </div>
{:else}
    <ContentCard variant="sides" thickness={0.55}>
        <div class="form-wrapper">
            {#if currentMedia?.imageUrl}
                <img height="300px" src={currentMedia.imageUrl} alt={currentMedia.title} />
                <div class="media-info">
                    {#if currentMedia.type === 'episode'}
                        <p class="episode-label">Episode {currentMedia.episode}</p>
                    {/if}
                    <h3>{currentMedia.title}</h3>
                </div>
            {/if}

            <form method="POST" action="/reviews" use:enhance>
                <input type="hidden" name="mediaId" value={selectedMediaId ?? ''} />
                <input type="hidden" name="authorId" value={user.id} />

                <div class="flex flex-col gap-4">
                    <MediaFilters
                        {allSeries}
                        initialValues={{
                            seriesId: selectedSeriesId?.toString() ?? '',
                            seasonId: selectedSeasonId?.toString() ?? '',
                            mediaId: selectedMediaId?.toString() ?? '',
                        }}
                        showEpisode={true}
                        showTitle={false}
                        showScore={false}
                        filtersOpen={true}
                        onChange={handleFilterChange}
                    />

                    {#if currentMedia}
                        <div class="form-group">
                            <label for="score">Score (1-999)</label>
                            <input type="number" id="score" name="score" min="1" max="999" required />
                        </div>

                        <div class="form-group">
                            <label for="body">Review</label>
                            <textarea id="body" name="body" rows="5" required></textarea>
                        </div>

                        <Button class="self-end" type="submit">Submit Review</Button>
                    {:else if selectedSeriesId}
                        <div class="no-media">
                            <p>Select an episode or movie to review</p>
                        </div>
                    {/if}
                </div>
            </form>
        </div>
    </ContentCard>
{/if}

<style>
    .form-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 1000px;
        width: 100%;
        padding: 0 1rem;
    }

    .episode-label {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.8;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        display: block;
        font-weight: 600;
        font-size: 0.95rem;
    }

    input[type='number'],
    textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
        font-family: inherit;
    }

    input:focus,
    textarea:focus {
        outline: none;
        border-color: var(--bluey);
        box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
    }

    .no-media {
        padding: 2rem;
        text-align: center;
        color: #666;
    }

    textarea {
        resize: vertical;
        min-height: 120px;
    }

    img {
        display: block;
        width: 100%;
        max-width: 500px;
        height: auto;
        margin: 0 auto;
        border-radius: 4px;
    }
</style>
