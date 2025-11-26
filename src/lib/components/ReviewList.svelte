<script lang="ts">
    import { getMediaBreadcrumbs } from '$lib/utils/mediaLinks'
    import type { GroupedReviews } from '../../routes/api/reviews/+server'
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
        {@const breadcrumbs = getMediaBreadcrumbs(group.media)}

        <ContentCard title={group.media.title}>
            {#snippet subtitle()}
                <MediaLinks {breadcrumbs} />
            {/snippet}
            <div class="flex gap-2">
                <img loading="lazy" src={group.media.imageUrl} alt={group.media.title} class="ep-image" />
                <span class="overview">
                    {group.media.overview}
                </span>
            </div>
            <hr class="lcars-bar" />
            {#each group.reviews as review, index}
                <Review {review} />
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
