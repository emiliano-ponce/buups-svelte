<script lang="ts">
    import type { GroupedReviews } from '../../routes/+page.server'
    import ContentCard from './ContentCard.svelte'
    import Review from './Review.svelte'

    interface ReviewListProps {
        reviews: GroupedReviews
    }
    let { reviews }: ReviewListProps = $props()
</script>

<div>
    {#each reviews as group}
        <ContentCard title={group.title}>
            {#each group.reviews as review}
                <Review {review} />
            {/each}
        </ContentCard>
    {/each}
</div>

<style>
    /* your styles go here */
</style>
