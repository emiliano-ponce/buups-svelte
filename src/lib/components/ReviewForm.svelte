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
    <div class="form-wrapper">
        {#if currentMedia?.imageUrl}
            <ContentCard variant="sides">
                <img src={currentMedia.imageUrl} alt={currentMedia.title} />
                <div class="media-info">
                    <h3>{currentMedia.title}</h3>
                    {#if currentMedia.type === 'episode'}
                        <p class="episode-label">Episode {currentMedia.episode}</p>
                    {/if}
                </div>
            </ContentCard>
        {/if}

        <form method="POST" action="/reviews" use:enhance>
            <input type="hidden" name="mediaId" value={selectedMediaId ?? ''} />
            <input type="hidden" name="authorId" value={user.id} />

            <MediaFilters
                allSeries={allSeries}
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
                    <div class="overview">
                        <p>{currentMedia.overview}</p>
                    </div>
                </div>

                <div class="form-group">
                    <label for="score">Score (1-999)</label>
                    <input type="number" id="score" name="score" min="1" max="999" required />
                </div>

                <div class="form-group">
                    <label for="body">Review</label>
                    <textarea id="body" name="body" rows="6" required></textarea>
                </div>

                <Button type="submit">Submit Review</Button>
            {:else if selectedSeriesId}
                <div class="no-media">
                    <p>Select an episode or movie to review</p>
                </div>
            {/if}
        </form>
    </div>
{/if}

<style>
    .form-wrapper {
        max-width: 1000px;
        width: 100%;
        padding: 1rem;
    }

    .media-info {
        padding: 0.5rem 0;
    }

    .media-info h3 {
        margin: 0 0 0.25rem 0;
        font-size: 1.25rem;
    }

    .episode-label {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.8;
    }

    .form-group {
        margin-bottom: 1.25rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        font-size: 0.95rem;
    }

    input[type="number"],
    textarea {
        width: 100%;
        padding: 0.625rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
        font-family: inherit;
        background-color: #fff;
    }

    input:focus,
    textarea:focus {
        outline: none;
        border-color: var(--blue, #0066cc);
        box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
    }

    .overview {
        padding: 0.75rem;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
    }

    .overview p {
        margin: 0;
        line-height: 1.5;
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
        width: 100%;
        height: auto;
        display: block;
        border-radius: 4px;
    }
</style>