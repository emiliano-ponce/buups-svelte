<script lang="ts">
    import type { GroupedReviews } from '../../routes/+page.server'

    interface ReviewListProps {
        reviews: GroupedReviews
    }
    let { reviews }: ReviewListProps = $props()
</script>

<div class="review-list">
    {#each reviews as group}
        <div class="media-group">
            <h3>{group.title}</h3>
            {#each group.reviews as review}
                <div class="review">
                    <!-- Your review content -->
                </div>
            {/each}
        </div>
    {/each}
</div>

<style>
    /* your styles go here */
</style>
