<script lang="ts">
    import type { Snippet } from 'svelte'

    type FrameSize = 'sm' | 'md' | 'lg' | 'flex'

    interface FramePartProps {
        children?: Snippet
        className?: string
        corner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
        // Determines the width of vertical frames and the height of horizontal frames
        size?: FrameSize
        // Determines the height of vertical frames and the width of horizontal frames
        thickness?: 1 | 2 | 3
    }

    let { corner, className, size = 'md', thickness = 2, children }: FramePartProps = $props()
    let style = corner ? `border-${corner}-radius: 160px;` : ''
</script>

<div class="frame-part {className} {size} thickness-{thickness}" {style}>
    {@render children?.()}
</div>

<style>
    .frame-part {
        color: #000;
        &.thickness-1 {
            --column-width: 28px;
            --row-height: 14px;
        }
        &.thickness-2 {
            --column-width: 160px;
            --row-height: 28px;
        }
        &.thickness-3 {
            --column-width: 230px;
            --row-height: 42px;
        }
        &.sm {
            --column-height: 90px;
            --row-width: 40px;
        }
        &.md {
            --column-height: 230px;
            --row-width: 200px;
        }
        &.lg {
            --column-height: 350px;
            --row-width: 400px;
        }
        &.flex {
            flex: 1;
            min-width: 40px;
            &.column {
                min-height: 40px;
            }
        }
        height: var(--row-height);
        width: var(--row-width);
        &.column {
            height: var(--column-height);
            width: var(--column-width);
        }
    }
</style>
