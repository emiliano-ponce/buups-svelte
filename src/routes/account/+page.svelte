<script lang="ts">
    import { enhance } from '$app/forms'
    import Button from '$lib/components/Button.svelte'
    import LCARSBar from '$lib/components/LCARSBar.svelte'
    import LCARSList from '$lib/components/LCARSList.svelte'
    import { playSoundAndRedirect } from '$lib/utils/audioHelpers'

    const { data, form } = $props()

    const listItems = $derived([
        `Username: ${data.accountUser.username}`,
        `Email: ${data.accountUser.email}`,
        `Number of reviews: ${data.accountUser.reviews.length}`,
    ])

    let isSyncing = $state(false)
</script>

<div>
    <LCARSBar>Account</LCARSBar>
    <div class="container">
        <LCARSList items={listItems} />
        <div>
            <Button
                --button-color="var(--moonlit-violet)"
                onclick={() => playSoundAndRedirect('beep2', '/account/password')}>Change Password</Button
            >
        </div>
    </div>
    <LCARSBar>Admin Actions</LCARSBar>
    <div class="container">
        <form 
            method="POST" 
            action="?/syncSheetToDB"
            use:enhance={() => {
                isSyncing = true
                return async ({ update, result }) => {
                    await update()
                    isSyncing = false
                    
                    // Optional: play sound on completion
                    if (result.type === 'success') {
                        // Play success sound
                    }
                }
            }}
        >
            <Button 
                --button-color="var(--bluey)" 
                type="submit"
                disabled={isSyncing}
            >
                {isSyncing ? 'Syncing...' : 'Sync Sheet to DB'}
            </Button>
        </form>
        
        {#if form?.message}
            <p class:success={form.success} class:error={!form.success}>
                {form.message}
            </p>
        {/if}
        
        {#if form?.stats}
            <div class="stats">
                <p>Synced: {form.stats.synced}</p>
                <p>Skipped: {form.stats.skipped}</p>
                <p>Errors: {form.stats.errors}</p>
            </div>
        {/if}
    </div>
</div>

<style>
</style>
