<script lang="ts">
    import type { Snippet } from 'svelte'
    
    interface Props {
        children: Snippet
        class?: string
    }
    
    let { children, class: className = '' }: Props = $props()
</script>

<nav class={className}>
    {@render children()}
</nav>

<style>
    nav {
        display: flex;
        flex-wrap: wrap;
        align-self: center;
        width: calc(var(--nav-width) + var(--nav-width) + 1rem);
        justify-content: flex-end;
        column-gap: 0.5rem;
        row-gap: 0.65rem;
    }

    @media (max-width: 1500px) {
        nav {
            column-gap: 0.375rem;
            row-gap: 0.5rem;
        }
    }

    @media (max-width: 1300px) {
        nav {
            padding-left: 0.5rem;
            gap: 0.5rem;
        }

        nav :global(button) {
            padding-bottom: 0.5rem;
            font-size: 1rem;
            padding-inline: 1.25rem;
        }
    }

    @media (max-width: 780px) {
        nav {
            flex: 1;
        }
    }

    @media (max-width: 450px) {
        nav :global(a),
        nav :global(button) {
            height: 63px;
            font-size: 0.875rem;
        }
    }
</style>