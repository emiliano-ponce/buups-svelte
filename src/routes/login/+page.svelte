<script lang="ts">
    import { enhance } from '$app/forms'
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
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required autofocus />
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required />
            </div>

            <Button --button-color="var(--blue)" class="ml-auto" type="submit" onclick={() => playSound('beep2')}>Log In</Button>
        </form>
    </ContentCard>
</div>

<style>
    .container {
        min-height: 500px;
    }

    form {
        margin: auto;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .form-group label {
        font-weight: bold;
        font-size: 1.25rem;
    }
    
    .form-group input {
        width: 100%;
    }

    .error {
        font-size: 1.25rem;
        font-weight: bold;
        color: var(--mars);
        text-align: center;
        margin-top: 0.5rem;
    }
</style>
