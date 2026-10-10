<script lang="ts">
    import { resolve } from '$app/paths'
    import { playSound } from '$lib/utils/audioHelpers'
    import type { Snippet } from 'svelte'

    interface Props {
        acronym: string
        class?: string
        current?: boolean
        title?: string
        children: Snippet
    }
    let { acronym, class: className = '', current = false, title, children }: Props = $props()
</script>

<!-- Plays a beep (respecting the button-beep setting) and lets SvelteKit's client-side
     navigation proceed; audio elements live in the root layout so the sound isn't cut off. -->
<a
    href={resolve('/series/[acronym]', { acronym })}
    class={className}
    {title}
    aria-current={current ? 'page' : undefined}
    onclick={() => playSound('beep1', 'buttons')}
>
    {@render children()}
</a>
