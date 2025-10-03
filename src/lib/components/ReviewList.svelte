<script lang="ts">
    import type { GroupedReviews } from '../../routes/+page.server'
    import ContentCard from './ContentCard.svelte'

    interface ReviewListProps {
        reviews: GroupedReviews
    }
    let { reviews }: ReviewListProps = $props()
</script>

<div class="review-list">
    {#each reviews as group}
        <ContentCard className="media-group" title={group.title}>
            <h3>{group.title}</h3>
            {#each group.reviews as review}
                <div class="review"></div>
            {/each}
        </ContentCard>
    {/each}
</div>

<style>
    /* your styles go here */
</style>
