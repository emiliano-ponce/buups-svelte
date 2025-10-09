<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements"
    const { children, ...rest }: HTMLButtonAttributes = $props()
</script>

<button {...rest} class={`button ${rest.class}`}>{@render children?.()}</button>

<style>
    .button {
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
