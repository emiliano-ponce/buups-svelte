<script lang="ts">
    import type { Snippet } from 'svelte'

    interface Props {
        children: Snippet
        variant?: 'standard' | 'alt'
        class?: string
    }

    let { children, variant = 'standard', class: className = '' }: Props = $props()
</script>

<div class="pillbox {variant === 'alt' ? 'pillbox-2' : ''} {className}">
    {@render children()}
</div>

<style>
    .pillbox,
    .pillbox-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 8px;
        margin: 1.25rem auto;
        text-align: right;
        font-size: var(--sub-fonts);
    }

    .pillbox :global(a),
    .pillbox :global(.pill) {
        display: flex;
        width: 100%;
        height: 56px;
        justify-content: flex-end;
        align-items: flex-end;
        text-decoration: none;
        color: black;
        font-weight: bold;
        padding-right: 0.75rem;
        padding-bottom: 0.35rem;
    }

    .pillbox-2 :global(a),
    .pillbox-2 :global(.pill-2) {
        display: flex;
        width: 100%;
        height: 56px;
        justify-content: flex-end;
        align-items: flex-end;
        text-decoration: none;
        color: black;
        font-weight: bold;
        padding-right: 0.75rem;
        padding-bottom: 0.35rem;
    }

    .pillbox :global(.pill:hover),
    .pillbox :global(a:hover),
    .pillbox-2 :global(.pill-2:hover),
    .pillbox-2 :global(a:hover) {
        filter: brightness(115%);
    }

    .pillbox :global(.pill:active),
    .pillbox :global(a:active),
    .pillbox-2 :global(.pill-2:active),
    .pillbox-2 :global(a:active) {
        filter: brightness(80%);
    }

    /* Standard pillbox - left rounded on odd rows */
    .pillbox :global(.pill:nth-child(odd)),
    .pillbox :global(a:nth-child(odd)) {
        border-radius: 100vmax 0 0 100vmax;
    }

    /* Alt pillbox - alternating rounded corners */
    .pillbox-2 :global(.pill-2:nth-child(odd)),
    .pillbox-2 :global(a:nth-child(odd)) {
        border-radius: 100vmax 0 0 100vmax;
    }

    .pillbox-2 :global(.pill-2:nth-child(even)),
    .pillbox-2 :global(a:nth-child(even)) {
        border-radius: 0 100vmax 100vmax 0;
        padding-right: 1rem;
    }

    /* Color assignments - requires CSS variables to be set on children */
    .pillbox :global(.pill:nth-child(1)),
    .pillbox :global(a:nth-child(1)) {
        background-color: var(--pill-1-color);
    }

    .pillbox :global(.pill:nth-child(2)),
    .pillbox :global(a:nth-child(2)) {
        background-color: var(--pill-2-color);
    }

    .pillbox :global(.pill:nth-child(3)),
    .pillbox :global(a:nth-child(3)) {
        background-color: var(--pill-3-color);
    }

    .pillbox :global(.pill:nth-child(4)),
    .pillbox :global(a:nth-child(4)) {
        background-color: var(--pill-4-color);
    }

    .pillbox :global(.pill:nth-child(5)),
    .pillbox :global(a:nth-child(5)) {
        background-color: var(--pill-5-color);
    }

    .pillbox :global(.pill:nth-child(6)),
    .pillbox :global(a:nth-child(6)) {
        background-color: var(--pill-6-color);
    }

    /* Alt color scheme */
    .pillbox-2 :global(.pill-2:nth-child(1)),
    .pillbox-2 :global(a:nth-child(1)) {
        background-color: var(--pill-a1-color);
    }

    .pillbox-2 :global(.pill-2:nth-child(2)),
    .pillbox-2 :global(a:nth-child(2)) {
        background-color: var(--pill-a2-color);
    }

    .pillbox-2 :global(.pill-2:nth-child(3)),
    .pillbox-2 :global(a:nth-child(3)) {
        background-color: var(--pill-a3-color);
    }

    .pillbox-2 :global(.pill-2:nth-child(4)),
    .pillbox-2 :global(a:nth-child(4)) {
        background-color: var(--pill-a4-color);
    }

    .pillbox-2 :global(.pill-2:nth-child(5)),
    .pillbox-2 :global(a:nth-child(5)) {
        background-color: var(--pill-a5-color);
    }

    .pillbox-2 :global(.pill-2:nth-child(6)),
    .pillbox-2 :global(a:nth-child(6)) {
        background-color: var(--pill-a6-color);
    }
</style>
