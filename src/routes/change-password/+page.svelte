<script lang="ts">
    import { enhance } from '$app/forms'
    import Button from '$lib/components/Button.svelte'
    import ContentCard from '$lib/components/ContentCard.svelte'
    import { playSound } from '$lib/utils/audioHelpers.js'

    export let form
</script>

<div class="container">
    <h1>Password Change Required</h1>

    {#if form?.error}
        <p class="error">{form.error}</p>
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
                <input type="password" id="newPassword" name="newPassword" required minlength="8" pattern=".*" />
                <small>Minimum 8 characters</small>
            </div>

            <div class="form-group">
                <label for="confirmPassword">Confirm New Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" required />
            </div>

            <Button --button-color="var(--blue)" class="ml-auto" type="submit" onclick={() => playSound('beep2')}>
                Change Password
            </Button>
        </form>
    </ContentCard>
</div>

<style>
</style>
