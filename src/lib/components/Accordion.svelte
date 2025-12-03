<script lang="ts">
    import type { Snippet } from 'svelte'

    interface Props {
        title: string
        children: Snippet
        limitWidth?: boolean
        open?: boolean
    }

    let { title, children, limitWidth = false, open = $bindable(false) }: Props = $props()

    let contentEl: HTMLDivElement | null = $state(null)

    function toggle() {
        open = !open
        if (contentEl) {
            if (open) {
                contentEl.style.maxHeight = `${contentEl.scrollHeight}px`
            } else {
                contentEl.style.maxHeight = ''
            }
        }
    }
</script>

<div class="accordion-wrapper" class:limit-width={limitWidth}>
    <button class="accordion" class:active={open} onclick={toggle} type="button">
        {title}
    </button>

    <div class="accordionContent" bind:this={contentEl}>
        {@render children()}
    </div>
</div>

<style>
    .accordion-wrapper {
        display: block;
        margin: 1.75rem auto;
        width: 100%;
    }

    .limit-width {
        max-width: 1240px;
    }

    .accordion {
        display: flex;
        align-items: center;
        min-height: 3rem;
        width: 100%;
        padding-right: 2.75rem;
        padding-left: 1rem;
        border-radius: 100vmax;
        background-color: var(--african-violet);
        border-left: solid 3rem var(--moonlit-violet);
        border-top: none;
        border-right: none;
        border-bottom: none;
        text-align: left;
        font-size: 1.25rem;
        color: var(--background-color);
        cursor: pointer;
        transition: 0.4s ease;
        position: relative;
    }

    .active,
    .accordion:hover {
        background-color: var(--violet-creme);
        border-left-color: var(--orange);
        filter: none;
    }

    .accordion:before {
        content: '';
        display: block;
        width: 0.5rem;
        height: 4rem;
        background-color: var(--background-color);
        position: absolute;
        top: 0;
        left: 0;
    }

    .accordion:after {
        display: block;
        content: '\276F';
        position: absolute;
        right: 1.5rem;
        top: 21%;
        transform: rotate(90deg);
        transition: 0.4s;
        font-weight: bold;
        color: var(--background-color);
    }

    .active:after {
        content: '\276F';
        transform: rotate(-90deg);
        transition: 0.4s ease;
    }

    .accordionContent {
        padding-block: 0.5rem;
        padding-inline: 3.5rem;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.25s ease-out;
    }

    .accordionContent :global(ul) {
        margin-left: 0;
    }

    @media (max-width: 525px) {
        .accordion {
            min-height: 2.5rem;
            font-size: 1rem;
            border-left-width: 2.5rem;
        }
    }
</style>
