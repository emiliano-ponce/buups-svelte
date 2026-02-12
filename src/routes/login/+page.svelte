<script lang="ts">
    import { enhance } from '$app/forms'
    import { resolve } from '$app/paths'
    import Button from '$lib/components/Button.svelte'
    import ContentCard from '$lib/components/ContentCard.svelte'
    import { playSound } from '$lib/utils/audioHelpers.js'

    export let form
</script>

<div class="container">
    <h1>Verify Identity</h1>

    {#if form?.error}
        <p class="error">{form.error}</p>
    {/if}

    <ContentCard variant="sides" className="h-96">
        <form method="POST" use:enhance>
            <div class="form-group">
                <label for="username">Email/Username</label>
                <!-- svelte-ignore a11y-autofocus -->
                <input type="text" id="username" name="username" required autofocus />
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required />
            </div>

            <div class="form-actions">
                <a href={resolve('/forgot-password', {})} class="mr-auto">Forgot password?</a>
                <Button --button-color="var(--blue)" type="submit" onclick={() => playSound('beep2', 'buttons')}>Log In</Button>
            </div>
        </form>
    </ContentCard>
</div>

<style>
</style>
