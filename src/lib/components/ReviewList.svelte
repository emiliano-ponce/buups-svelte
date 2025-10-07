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
            
            {#each group.reviews as review}
                <Review {review} />
            {/each}
        </ContentCard>
    {/each}
</div>

<style>
</style>