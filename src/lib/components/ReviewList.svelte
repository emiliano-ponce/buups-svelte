<script lang="ts">
    import { getMediaBreadcrumbs } from '$lib/utils/mediaLinks'
    import type { GroupedReviews } from '../../routes/+page.server'
    import ContentCard from './ContentCard.svelte'
    import MediaLinks from './MediaLinks.svelte'
    import Review from './Review.svelte'

    interface ReviewListProps {
        reviews: GroupedReviews
    }
    let { reviews }: ReviewListProps = $props()
</script>

<div>
    {#each reviews as group}
        {@const firstMedia = group.reviews[0].media}
        {@const breadcrumbs = getMediaBreadcrumbs(firstMedia)}

        <ContentCard title={group.title}>
            {#snippet subtitle()}
                <MediaLinks {breadcrumbs} />
            {/snippet}
            <div class="flex gap-2">
                <img loading="lazy" src={firstMedia.imageUrl} alt={firstMedia.title} class="ep-image" />
                <span class="overview">
                    {firstMedia.overview}
                </span>
            </div>
            <hr class="lcars-bar" />
            {#each group.reviews as review, index}
                <Review {review} />
                {#if index < group.reviews.length - 1}
                    <hr class="lcars-bar" />
                {/if}
            {/each}
        </ContentCard>
    {/each}
</div>

<style>
    .ep-image {
        display: block;
        margin: auto 0;
        width: 200px;
        height: 112px;
        object-fit: cover;
    }
    .overview {
        color: var(--banner-color);
    }
</style>
