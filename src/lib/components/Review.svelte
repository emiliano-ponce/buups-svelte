<script lang="ts">
    import { getIsMobile } from '$lib/utils/global.svelte'
    import type { DisplayReview } from '../../routes/api/reviews/+server'
    import Scorebar from './Scorebar.svelte'

    interface ReviewProps {
        review: DisplayReview
    }
    let { review }: ReviewProps = $props()

    let expanded = $state(false)

    const scorePercentage = $derived((review.score / 10) * 100)
</script>

<div class="review">
    <div class="review-header">
        <a class="author" href="/users/{review.author}">
            <h4>{review.author}</h4>
        </a>
        <Scorebar score={review.score} />
    </div>
    <div class={['review-body', { expanded: !getIsMobile() || expanded }]}>
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
    }

    .review:last-child {
        padding-bottom: 0;
    }

    .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        gap: 0.5rem;
    }

    .author {
        text-decoration: none;
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
