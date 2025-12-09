<script lang="ts">
    import Button from '$lib/components/Button.svelte'
    import LCARSBar from '$lib/components/LCARSBar.svelte'
    import LCARSList from '$lib/components/LCARSList.svelte'
    import { playSoundAndRedirect } from '$lib/utils/audioHelpers'

    const { data } = $props()

    const listItems = $derived([
        `Username: ${data.accountUser.username}`,
        `Email: ${data.accountUser.email}`,
        `Number of reviews: ${data.accountUser.reviews.length}`,
    ])
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
</div>

<style>
</style>
