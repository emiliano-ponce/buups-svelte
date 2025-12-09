<script lang="ts">
    import ReviewForm from '$lib/components/ReviewForm.svelte'

    let { data } = $props()
</script>

<div class="container">
    <ReviewForm media={data.nextMedia} user={data.user} allSeries={data.allSeries} />
</div>

<style>
    .container {
        max-width: 1100px;
        margin: 0 auto;
    }
</style>
