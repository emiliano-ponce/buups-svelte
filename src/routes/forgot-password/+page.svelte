<script lang="ts">
    import { enhance } from '$app/forms'
    import { resolve } from '$app/paths'
    import Button from '$lib/components/Button.svelte'
    import ContentCard from '$lib/components/ContentCard.svelte'
    import { playSound } from '$lib/utils/audioHelpers.js'

    export let form
</script>

<div class="container">
    <h1>Forgot Password</h1>
    <p class="info-text">Enter your email address and we'll send you a password reset link.</p>

    {#if form?.error}
        <p class="error">{form.error}</p>
    {/if}

    {#if form?.success}
        <p class="success">{form.success}</p>
    {/if}

    <ContentCard variant="sides" className="h-96">
        <form method="POST" use:enhance>
            <div class="form-group">
                <label for="email">Email Address</label>
                <!-- svelte-ignore a11y-autofocus -->
                <input type="email" id="email" name="email" required autofocus />
            </div>

            <div class="button-group">
                <Button --button-color="var(--blue)" type="submit" onclick={() => playSound('beep2')}>
                    Send Reset Link
                </Button>
                <a href={resolve('/login', {})} class="back-link">Back to Login</a>
            </div>
        </form>
    </ContentCard>
</div>

<style>
    .button-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
    }
</style>
