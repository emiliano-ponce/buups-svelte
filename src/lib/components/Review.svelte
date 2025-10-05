<script lang="ts">
    import { getIsMobile } from '$lib/utils/global.svelte'
    import { onMount } from 'svelte'
    import type { DisplayReview } from '../../routes/+page.server'

    interface ReviewProps {
        review: DisplayReview
    }
    let { review }: ReviewProps = $props()

    let expanded = $state(!getIsMobile())
    let timeoutId
    onMount(() => {
        window.addEventListener('resize', () => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                if (!getIsMobile() && !expanded) {
                    expanded = true
                }
            }, 100)
        })
        return () => {
            window.removeEventListener('resize', () => {})
        }
    })

    const scorePercentage = (review.score / 10) * 100
</script>

<div class="review">
    <div class="review-header">
        <h4 class="author">{review.author.username}</h4>
        <div class="score-container">
            <div class="score-bar">
                <div class="score-fill" style="width: {scorePercentage}%"></div>
            </div>
            <span class="score-text">{review.score}</span>
        </div>
    </div>
    <div class="review-body" class:expanded>
        {review.body}
    </div>
    {#if getIsMobile()}
        <button class="show-more" onclick={() => (expanded = !expanded)}>
            {expanded ? 'Show less' : 'Show more'}
        </button>
    {/if}
</div>

<style>
    .review {
        padding: 0.5rem 0;
        border-bottom: 1px solid #e5e7eb;
    }

    .review:last-child {
        padding-bottom: 0;
        border-bottom: none;
    }

    .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        gap: 0.5rem;
    }

    .author {
        color: var(--banner-color);
    }

    .score-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        justify-content: flex-end;
    }

    .score-bar {
        width: 100%;
        max-width: 300px;
        height: 1.5rem;
        background: var(--space-white);
        border: 1px solid var(--space-white);
        border-radius: 2px;
        overflow: hidden;
        @media (max-width: 768px) {
            max-width: 100px;
        }
    }

    .score-fill {
        height: 100%;
        background-image: repeating-linear-gradient(
            to right,
            var(--mars) 0px,
            var(--mars) 2px,
            var(--space-white) 2px,
            var(--space-white) 3px
        );
    }

    .score-text {
        font-weight: 700;
        color: var(--magenta);
        font-size: 1.25rem;
    }

    .review-body {
        color: white;
        line-height: 1.5;

        /* Clamp to 3 lines */
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .review-body.expanded {
        display: block;
        -webkit-line-clamp: unset;
        line-clamp: unset;
    }

    .show-more {
        background: none;
        border: none;
        color: var(--link-color);
        cursor: pointer;
        padding: 0;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .show-more:hover {
        text-decoration: underline;
    }
</style>
