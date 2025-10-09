<script lang="ts">
    import { getIsMobile } from '$lib/utils/global.svelte'
    import type { ReviewWithRelations } from '../../routes/+page.server'

    interface ReviewProps {
        review: ReviewWithRelations
    }
    let { review }: ReviewProps = $props()

    let expanded = $state(false)

    const scorePercentage = (review.score / 10) * 100
</script>

<div class="review">
    <div class="review-header">
        <a class="author" href="/users/{review.author.username}">
            <h4>{review.author.username}</h4>
        </a>
        <div class="score-container">
            <div class="score-bar">
                <div class="score-fill" style="width: {scorePercentage}%"></div>
            </div>
            <span class="score-text">{review.score}</span>
        </div>
    </div>
    <div class={["review-body", { expanded: !getIsMobile() || expanded }]}>
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
