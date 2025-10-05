<script lang="ts">
    interface BarProps {
        className?: string
        children?: any
        orientation?: 'horizontal' | 'vertical' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    }
    let { className = '', children, orientation = 'vertical' }: BarProps = $props()
</script>

<div class={`bar ${orientation} ${className}`}>
    {@render children?.()}
</div>

<style>
    .bar {
        --lg-direction: to bottom right;
        --after-radius: 50% 0 0 0;

        width: var(--thickness, 1.5rem);
        height: var(--size, unset);
        min-height: 1rem;
        flex: var(--flex, unset);
        background: var(--color, var(--bluey));
        position: relative;
        &::before {
            display: block;
            width: var(--thickness);
            height: var(--thickness);
            background: linear-gradient(var(--lg-direction), var(--color, var(--bluey)) 50%, var(--background) 50%);
            position: absolute;
            z-index: 1;
        }
        &::after {
            display: block;
            width: var(--thickness);
            height: var(--thickness);
            background-color: var(--background);
            border-radius: var(--after-radius);
            position: absolute;
            z-index: 1;
        }
        &.horizontal {
            width: var(--size, unset);
            min-width: 1rem;
            height: var(--thickness, 1.5rem);
            min-height: unset;
            flex: var(--flex, unset);
        }
        &.vertical {
        }
        &.top-left {
            border-top-left-radius: 100px;
            &::before,
            &::after {
                content: '';
                top: var(--thickness2, var(--thickness));
                left: var(--thickness);
            }
        }
        &.top-right {
            border-top-right-radius: 100px;
            --lg-direction: to bottom left;
            --after-radius: 0 50% 0 0;
            &::before,
            &::after {
                content: '';
                top: var(--thickness2, var(--thickness));
                right: var(--thickness);
            }
        }
        &.bottom-right {
            border-bottom-right-radius: 100px;
            --lg-direction: to top left;
            --after-radius: 0 0 50% 0;
            &::before,
            &::after {
                content: '';
                bottom: var(--thickness2, var(--thickness));
                right: var(--thickness);
            }
        }
        &.bottom-left {
            border-bottom-left-radius: 100px;
            --lg-direction: to top right;
            --after-radius: 0 0 0 50%;
            &::before,
            &::after {
                content: '';
                bottom: var(--thickness2, var(--thickness));
                left: var(--thickness);
            }
        }
    }
</style>
