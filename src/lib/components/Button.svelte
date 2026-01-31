<script lang="ts">
    import { playSound } from '$lib/utils/audioHelpers'
    import type { HTMLButtonAttributes } from 'svelte/elements'
    import Loader from './Loader.svelte'
    interface ButtonProps extends HTMLButtonAttributes {
        sound?: string
        loading?: boolean
    }
    const { children, sound, loading, ...rest }: ButtonProps = $props()

    const handleClick: HTMLButtonAttributes['onclick'] = e => {
        if (sound) {
            playSound(sound)
        }
        if (rest.onclick) {
            rest.onclick(e)
        }
    }
</script>

<button {...rest} class={`${rest.class} ${loading ? 'loading' : ''}`} onclick={handleClick}>
    {#if loading}
        <Loader />
    {/if}
    {@render children?.()}
</button>

<style>
    button {
        cursor: pointer;
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        align-items: flex-end;
        min-width: var(--nav-width);
        height: calc(var(--nav-width) / 2.8);
        padding-inline: 1.5rem;
        padding-bottom: 0.7rem;
        border-radius: 100vmax;
        background-color: var(--button-color);
        text-align: right;
        line-height: 1.175;
        text-decoration: none;
        text-transform: uppercase;
        font-weight: bold;
        color: black;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        &:hover,
        &:active {
            animation: none;
        }
        &:hover {
            filter: brightness(115%);
        }
        &:active {
            filter: brightness(80%);
        }
        &.loading,
        &:disabled {
            opacity: 0.5;
            pointer-events: none;
        }
    }
</style>
