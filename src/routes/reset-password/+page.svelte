<script lang="ts">
    import { enhance } from '$app/forms'
    import { resolve } from '$app/paths'
    import { page } from '$app/stores'
    import Button from '$lib/components/Button.svelte'
    import ContentCard from '$lib/components/ContentCard.svelte'
    import { playSound } from '$lib/utils/audioHelpers.js'

    export let form
    export let data

    $: token = $page.url.searchParams.get('token')
</script>

<div class="container">
    <h1>Reset Password</h1>

    {#if !data.validToken}
        <p class="error">This password reset link is invalid or has expired.</p>
        <div class="center">
            <a href={resolve('/forgot-password', {})}>
                <Button --button-color="var(--blue)">Request New Link</Button>
            </a>
        </div>
    {:else}
        {#if form?.error}
            <p class="error">{form.error}</p>
        {/if}

        {#if form?.success}
            <p class="success">{form.success}</p>
            <div class="center">
                <a href={resolve('/login', {})}>
                    <Button --button-color="var(--blue)">Go to Login</Button>
                </a>
            </div>
        {:else}
            <ContentCard variant="sides" className="h-96">
                <form method="POST" use:enhance>
                    <input type="hidden" name="token" value={token} />

                    <div class="form-group">
                        <label for="newPassword">New Password</label>
                        <!-- svelte-ignore a11y-autofocus -->
                        <input type="password" id="newPassword" name="newPassword" required minlength="8" autofocus />
                        <small>Minimum 8 characters</small>
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">Confirm New Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" required />
                    </div>

                    <Button
                        --button-color="var(--blue)"
                        class="ml-auto"
                        type="submit"
                        onclick={() => playSound('beep2', 'buttons')}
                    >
                        Reset Password
                    </Button>
                </form>
            </ContentCard>
        {/if}
    {/if}
</div>

<style>
    .center {
        display: flex;
        justify-content: center;
        margin-top: 1.5rem;
    }
</style>
