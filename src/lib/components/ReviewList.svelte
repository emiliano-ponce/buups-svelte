<script>
    let { reviews } = $props();
</script>

<style>
    /* your styles go here */
</style>

<div class="review-list">
    {#each reviews as review}
        <div class="review">
            <h1>{review.title}</h1>
            <p>{review.body}</p>
        </div>
    {/each}
</div>