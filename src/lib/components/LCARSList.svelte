<script lang="ts">
    import type { Snippet } from 'svelte'

    interface Props {
        items?: string[]
        children?: Snippet
        variant?: 'standard' | 'alt'
        bulletColor?: string
        textColor?: string
        class?: string
    }

    let { items = [], children, variant = 'standard', bulletColor, textColor, class: className = '' }: Props = $props()

    const listClass = variant === 'alt' ? 'lcars-list-2' : 'lcars-list'
</script>

<ul class="{listClass} {className}" style:--bullet-color={bulletColor} style:--text-color={textColor}>
    {#if children}
        {@render children()}
    {:else}
        {#each items as item}
            <li>{item}</li>
        {/each}
    {/if}
</ul>

<style>
    .lcars-list {
        margin-block: 1.15rem;
        margin-left: 2rem;
        list-style: none;
    }

    .lcars-list li {
        position: relative;
        padding-block: 0.45rem;
        padding-left: 2.25rem;
        text-box: trim-both cap alphabetic;
    }

    .lcars-list li::before {
        content: '';
        display: block;
        width: 34px;
        height: 18px;
        border-radius: 50%;
        background-color: var(--bullet-color, var(--font-color));
        position: absolute;
        top: 0.45rem;
        left: 0;
    }

    @media (max-width: 650px) {
        .lcars-list {
            margin-left: 0.5rem;
        }

        .lcars-list li::before {
            transform: scale(90%);
        }
    }

    /* Alternative list style */
    .lcars-list-2 {
        margin: 0 auto 50px auto;
        padding-left: 5px;
        list-style: none;
    }

    .lcars-list-2 li {
        position: relative;
        padding-bottom: 5px;
        padding-left: 38px;
        font-size: var(--sub-fonts);
        color: var(--text-color, var(--orange));
    }

    .lcars-list-2 li::before {
        content: '';
        display: block;
        width: 24px;
        height: 14px;
        border-radius: 50%;
        background-color: var(--bullet-color, var(--orange));
        position: absolute;
        top: 8px;
        left: 0;
    }
</style>
