<script lang="ts">
    import type { Snippet } from 'svelte'

    interface Props {
        open?: boolean
        title: string
        showTitle?: boolean
        align?: 'start' | 'end'
        class?: string
        panelTop?: string
        minWidth?: string
        trigger: Snippet<[toggle: () => void]>
        children: Snippet
    }

    let {
        open = $bindable(false),
        title,
        showTitle = true,
        align = 'end',
        class: className = '',
        panelTop = 'calc(100% + 0.5rem)',
        minWidth = '14rem',
        trigger,
        children,
    }: Props = $props()

    let rootElement: HTMLDivElement | null = $state(null)

    function toggle() {
        open = !open
    }

    function handleClickOutside(event: MouseEvent) {
        if (open && rootElement && !rootElement.contains(event.target as Node)) {
            open = false
        }
    }

    $effect(() => {
        if (open) {
            document.addEventListener('click', handleClickOutside)
            return () => document.removeEventListener('click', handleClickOutside)
        }
    })
</script>

<div bind:this={rootElement} class="popover-root {className}">
    {@render trigger(toggle)}
    {#if open}
        <dialog
            open
            class="popover-panel {align === 'start' ? 'align-start' : ''}"
            style="--popover-top: {panelTop}; --popover-min-width: {minWidth};"
            aria-label={title}
        >
            {#if showTitle}<div class="popover-header">{title}</div>{/if}
            <div class="popover-content">{@render children()}</div>
        </dialog>
    {/if}
</div>

<style>
    .popover-root {
        position: relative;
        display: inline-flex;
        z-index: 1000;
    }
    .popover-root.full-width {
        display: block;
    }
    .popover-panel {
        position: absolute;
        top: var(--popover-top);
        left: auto;
        right: 0;
        z-index: 1000;
        box-sizing: border-box;
        width: max-content;
        min-width: var(--popover-min-width);
        max-width: calc(100vw - 2rem);
        margin: 0;
        padding: 1rem;
        border: 2px solid var(--african-violet, #9999ff);
        border-radius: 20px;
        background: #000;
        box-shadow: 0 4px 20px rgba(153, 153, 255, 0.3);
    }
    .popover-panel.align-start {
        right: auto;
        left: 0;
    }
    .popover-header {
        margin-bottom: 0.9rem;
        color: var(--african-violet, #9999ff);
        font-size: 1.5rem;
        font-weight: bold;
        text-transform: uppercase;
    }
    .popover-content {
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
    }
</style>