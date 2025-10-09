<script lang="ts">
  import { enhance } from '$app/forms'
  import { playSound } from '$lib/utils/audioHelpers'
  import Button from './Button.svelte'
</script>

<form method="POST" action="/logout" use:enhance>
  <Button type="submit" --button-color="var(--red)" onclick={() => playSound('beep2')}>Logout</Button>
</form>

<style>
</style>