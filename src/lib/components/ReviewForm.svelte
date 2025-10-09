<script lang="ts">
    import { page } from '$app/state'
    import type { Media } from '$lib/server/db/schema'

    interface ReviewFormProps {
        media: Media
    }

    const user = page.data.user
</script>

{#if user}
    <form></form>
{/if}

<style>
    /* your styles go here */
</style>
