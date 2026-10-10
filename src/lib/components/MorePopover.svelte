<script lang="ts">
    import Button from '$lib/components/Button.svelte'
    import Popover from '$lib/components/Popover.svelte'
    import { playSoundAndRedirect } from '$lib/utils/audioHelpers'

    let open = $state(false)
</script>

<Popover bind:open title="More" minWidth="14rem" showTitle={false}>
    {#snippet trigger(toggle)}
        <Button
            --button-color="var(--butterscotch)"
            onclick={toggle}
            aria-haspopup="dialog"
            aria-expanded={open}
        >
            More
        </Button>
    {/snippet}

    <div class="more-options">
        <Button
            --button-color="var(--orange)"
            class="more-option"
            onclick={() => playSoundAndRedirect('beep2', '/account', 'buttons')}
        >
            Account
        </Button>
        <Button
            --button-color="var(--butterscotch)"
            class="more-option"
            onclick={() => playSoundAndRedirect('beep2', '/series', 'buttons')}
        >
            Series
        </Button>
    </div>
</Popover>

<style>
    .more-options {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>