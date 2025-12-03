<script lang="ts">
    import type { Snippet } from 'svelte'

    interface Props {
        variant?: 'simple' | 'text'
        text?: string
        children?: Snippet
        alignEnd?: boolean
        class?: string
    }

    let { variant = 'simple', text, children, alignEnd = false, class: className = '' }: Props = $props()
</script>

{#if variant === 'simple'}
    <div class="lcars-bar {className}"></div>
{:else}
    <div class="lcars-text-bar {className}" class:the-end={alignEnd}>
        {#if text}
            <span>{text}</span>
        {:else if children}
            {@render children()}
        {/if}
    </div>
{/if}

<style>
    .lcars-bar {
        margin-block: 1.75rem;
        height: clamp(15px, 2vh, 25px);
        background: transparent;
        border-right: clamp(15px, 2vh, 25px) solid var(--lcars-bar-end-color);
        border-left: clamp(15px, 2vh, 25px) solid var(--lcars-bar-start-color);
        border-radius: 100vmax;
        position: relative;
    }

    .lcars-bar::after {
        content: '';
        display: block;
        height: clamp(15px, 2vh, 25px);
        width: 100%;
        background-color: var(--lcars-bar-color);
        border-right: 0.8vh solid black;
        border-left: 0.8vh solid black;
        position: absolute;
        top: 0;
        left: 0;
    }

    .lcars-text-bar {
        display: flex;
        position: relative;
        height: clamp(16px, 4vh, 41px);
        margin-block: 2.75rem;
        overflow: visible;
        border-radius: 100vmax;
        background-color: var(--lcars-bar-color);
        border-right: clamp(16px, 4vh, 43px) solid var(--lcars-bar-end-color);
        border-left: clamp(16px, 4vh, 43px) solid var(--lcars-bar-start-color);
    }

    .the-end {
        justify-content: flex-end;
    }

    .lcars-text-bar :global(h2),
    .lcars-text-bar :global(h3),
    .lcars-text-bar :global(h4),
    .lcars-text-bar :global(span) {
        margin-block: 0;
        background-color: black;
        height: clamp(20px, 5.5vh, 60px);
        overflow: visible;
        border-top: 1px solid black;
        padding-inline: 1vh;
        font-size: clamp(17px, 4.5vh, 46px);
        line-height: 1;
        text-transform: uppercase;
        color: var(--lcars-bar-text-color);
        z-index: 1;
        text-box: trim-both cap alphabetic;
    }

    .lcars-text-bar::before {
        content: '';
        background-color: black;
        display: block;
        width: 1vh;
        height: 6vh;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
    }

    .lcars-text-bar::after {
        content: '';
        background-color: black;
        display: block;
        width: 1vh;
        height: 6vh;
        position: absolute;
        top: 0;
        right: 0;
        overflow: hidden;
    }

    @-moz-document url-prefix() {
        .lcars-text-bar :global(h2),
        .lcars-text-bar :global(h3),
        .lcars-text-bar :global(h4),
        .lcars-text-bar :global(span) {
            position: absolute;
            top: -0.7vh;
        }
    }
</style>
