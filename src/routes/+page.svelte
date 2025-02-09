<script lang="ts">
    import ReviewList from '$lib/components/ReviewList.svelte'
    import type { PageProps } from './$types'

    let { data }: PageProps = $props()
</script>

<ReviewList reviews={data.reviews} />

<style>
</style>
