<script lang="ts">
    import { playSound } from "$lib/utils/audioHelpers"
    import type { HTMLButtonAttributes } from "svelte/elements"
    interface ButtonProps extends HTMLButtonAttributes {
        sound?: string
    }
    const { children, sound, ...rest }: ButtonProps = $props()

    const handleClick: HTMLButtonAttributes['onclick'] = (e) => {
        if (sound) {
            playSound(sound)
        }
        if (rest.onclick) {
            rest.onclick(e)
        }
    }
</script>

<button {...rest} class={rest.class} onclick={handleClick}>{@render children?.()}</button>

<style>
    button {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        width: var(--nav-width);
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
        &:hover, &:active {
            animation: none;
        }
        &:hover {
            filter: brightness(115%);
        }
        &:active {
            filter: brightness(80%);
        }
        &:disabled {
            opacity: 0.5;
            pointer-events: none;
        }
    }
</style>
