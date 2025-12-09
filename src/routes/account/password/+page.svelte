<script lang="ts">
    import { enhance } from '$app/forms'
    import { resolve } from '$app/paths'
    import Button from '$lib/components/Button.svelte'
    import ContentCard from '$lib/components/ContentCard.svelte'
    import { playSound } from '$lib/utils/audioHelpers.js'

    export let form
</script>

<div class="container">
    <h1>Change Password</h1>

    {#if form?.error}
        <p class="error">{form.error}</p>
    {/if}

    {#if form?.success}
        <p class="success">{form.success}</p>
    {/if}

    <ContentCard variant="sides" className="h-96">
        <form method="POST" use:enhance>
            <div class="form-group">
                <label for="currentPassword">Current Password</label>
                <!-- svelte-ignore a11y-autofocus -->
                <input type="password" id="currentPassword" name="currentPassword" required autofocus />
            </div>

            <div class="form-group">
                <label for="newPassword">New Password</label>
                <input type="password" id="newPassword" name="newPassword" required minlength="8" />
                <small>Minimum 8 characters</small>
            </div>

            <div class="form-group">
                <label for="confirmPassword">Confirm New Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required />
            </div>

            <div class="button-group">
                <Button --button-color="var(--blue)" type="submit" onclick={() => playSound('beep2')}>
                    Change Password
                </Button>
                <a href={resolve('/account', {})} class="back-link">Back to Account</a>
            </div>
        </form>
    </ContentCard>
</div>

<style>
    .button-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }
</style>
