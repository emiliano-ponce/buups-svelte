<script lang="ts">
    import { enhance } from '$app/forms'
    import type { Media, Review, Series } from '$lib/server/db/schema'
    import Button from './Button.svelte'
    import ContentCard from './ContentCard.svelte'
    import MediaFilters, { type FilterValues } from './MediaFilters.svelte'
    import Scorebar from './Scorebar.svelte'

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

    // Existing review state
    let existingReviews = $state<Review[]>([])
    let selectedReviewId = $state<number | 'new'>('new')
    let loadingReview = $state(false)

    // Form field state (for pre-filling with existing review)
    let scoreValue = $state<number | ''>('')
    let bodyValue = $state('')

    // Derived state for UI
    let selectedReview = $derived(
        selectedReviewId === 'new' ? null : (existingReviews.find(r => r.id === selectedReviewId) ?? null)
    )
    let isEditing = $derived(selectedReview !== null)
    let submitButtonText = $derived(isEditing ? 'Update Review' : 'Submit Review')

    function handleFilterChange(values: FilterValues) {
        selectedSeriesId = values.seriesId ? parseInt(values.seriesId) : null
        selectedSeasonId = values.seasonId ? parseInt(values.seasonId) : null
        selectedMediaId = values.mediaId ? parseInt(values.mediaId) : null

        if (selectedMediaId) {
            fetchMediaDetails(selectedMediaId)
            fetchExistingReviews(selectedMediaId)
        } else {
            currentMedia = null
            existingReviews = []
            selectedReviewId = 'new'
            resetForm()
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

    async function fetchExistingReviews(mediaId: number) {
        if (!user) return

        loadingReview = true
        try {
            const res = await fetch(`/api/media/${mediaId}/reviews`)
            const reviews = await res.json()

            existingReviews = reviews

            if (reviews && reviews.length > 0) {
                // Default to the first (most recent) review
                selectedReviewId = reviews[0].id
                loadReviewIntoForm(reviews[0])
            } else {
                selectedReviewId = 'new'
                resetForm()
            }
        } catch (err) {
            console.error('Failed to fetch existing reviews:', err)
            existingReviews = []
            selectedReviewId = 'new'
            resetForm()
        } finally {
            loadingReview = false
        }
    }

    function loadReviewIntoForm(review: Review) {
        scoreValue = review.score
        bodyValue = review.body
    }

    function handleReviewSelect(reviewId: number | 'new') {
        selectedReviewId = reviewId

        if (reviewId === 'new') {
            resetForm()
        } else {
            const review = existingReviews.find(r => r.id === reviewId)
            if (review) {
                loadReviewIntoForm(review)
            }
        }
    }

    function resetForm() {
        scoreValue = ''
        bodyValue = ''
    }

    function handleFormSuccess() {
        // Refetch to update the existing reviews state
        if (selectedMediaId) {
            fetchExistingReviews(selectedMediaId)
        }
    }

    function handleDeleteSuccess() {
        // Remove from local array and reset to new
        existingReviews = existingReviews.filter(r => r.id !== selectedReviewId)
        selectedReviewId = 'new'
        resetForm()
    }

    function handleScoreChange(newScore: number) {
        scoreValue = newScore
    }

    async function handleDeleteClick() {
        if (!selectedReview) return

        if (!confirm('Are you sure you want to delete this review?')) return

        try {
            const formData = new FormData()
            formData.set('reviewId', selectedReview.id.toString())

            const res = await fetch('/reviews?/delete', {
                method: 'POST',
                body: formData,
            })

            if (res.ok) {
                handleDeleteSuccess()
            } else {
                console.error('Failed to delete review')
            }
        } catch (err) {
            console.error('Delete request failed:', err)
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

            <form
                method="POST"
                action={isEditing ? '/reviews?/update' : '/reviews'}
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            handleFormSuccess()
                        }
                        await update()
                    }
                }}
            >
                <input type="hidden" name="mediaId" value={selectedMediaId ?? ''} />
                {#if isEditing && selectedReview}
                    <input type="hidden" name="reviewId" value={selectedReview.id} />
                {/if}

                <div class="flex flex-col gap-4">
                    <div class="flex gap-4">
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
                        <div class="form-group flex-1">
                            <label for="review-select">Edit Review</label>
                            <select
                                id="review-select"
                                disabled={!existingReviews.length}
                                bind:value={() => selectedReviewId, handleReviewSelect}
                            >
                                <option value="new">Add New</option>
                                {#each existingReviews as review, index}
                                    <option value={review.id}>
                                        Review {existingReviews.length - index} (Score: {review.score})
                                    </option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    {#if loadingReview}
                        <div class="loading">
                            <p>Checking for existing reviews...</p>
                        </div>
                    {:else if currentMedia}
                        <div class="form-group">
                            <label for="score">Score</label>
                            <Scorebar score={scoreValue || 0} editable onChange={handleScoreChange} />
                        </div>

                        <div class="form-group">
                            <label for="body">Review</label>
                            <textarea id="body" name="body" rows="5" required bind:value={bodyValue}></textarea>
                        </div>

                        <div class="form-actions">
                            <Button
                                --button-color="var(--red)"
                                disabled={!isEditing || !selectedReview}
                                type="button"
                                onclick={handleDeleteClick}
                            >
                                Delete Review
                            </Button>
                            <Button class="self-end" type="submit">{submitButtonText}</Button>
                        </div>
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

    #review-select {
        max-width: 360px;
        &:disabled {
            opacity: 0.5;
        }
    }

    .no-media,
    .loading {
        padding: 2rem;
        text-align: center;
        color: #666;
    }

    img {
        display: block;
        width: 100%;
        max-width: 500px;
        height: auto;
        margin: 0 auto;
        border-radius: 4px;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 0.5rem;
    }
</style>
