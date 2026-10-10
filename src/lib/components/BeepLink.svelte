<script lang="ts">
    import { resolve } from '$app/paths'
    import { playSound } from '$lib/utils/audioHelpers'
    import type { Snippet } from 'svelte'

    interface Props {
        href: string
        class?: string
        title?: string
        current?: boolean
        children: Snippet
    }
    let { href, class: className = '', title, current = false, children }: Props = $props()
</script>

<!-- Uses the site's default purple link style (--link-color). Plays beep1 when button beeps are
     enabled; navigation stays client-side so the sound isn't cut off. -->
<a
    href={resolve(href as '/', {})}
    class={className}
    {title}
    aria-current={current ? 'page' : undefined}
    onclick={() => playSound('beep1', 'buttons')}
>
    {@render children()}
</a>
