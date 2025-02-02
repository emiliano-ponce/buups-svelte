<script lang="ts">
  import type { Snippet } from 'svelte';

  interface FrameProps {
    variant?: 'full' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    size?: 'sm' | 'md' | 'lg';
    children: Snippet;
  }
  let { variant = 'full', size = 'md', children }: FrameProps = $props();

  let computedStyle =
    variant === 'full' ? `border-radius: 160px;` : `border-${variant}-radius: 160px;`;
  const shouldShow = (frameSide: 'top' | 'right' | 'bottom' | 'left') => {
    return variant === 'full' || variant.includes(frameSide);
  };
</script>

<div class="frame {size} {variant} flex">
  <div class="frame-left gap-0.5">
    <div class="corner bg-red flex-1"></div>
    <div class="bg-blue flex-1"></div>
    <div class="bg-purple flex-1"></div>
  </div>
  <div class="frame-middle">
    {#if shouldShow('top')}<div class="frame-top-row flex gap-0.5"></div>{/if}
    <div class="content-wrap">
      <div class="content" style={computedStyle}>
        {@render children()}
      </div>
    </div>
    {#if shouldShow('bottom')}<div class="frame-bottom-row flex gap-0.5"></div>{/if}
  </div>
  {#if shouldShow('right')}<div class="frame-right-col flex-col gap-0.5">
      <div class="bg-red flex-1"></div>
      <div class="bg-blue flex-1"></div>
      <div class="corner bg-purple flex-1"></div>
    </div>{/if}
</div>

<style>
  .frame {
    height: 100%;
    width: 100%;
    min-height: 250px;
    min-width: 250px;
    &.sm {
      --column-width: 115px;
      --row-height: 14px;
    }
    &.md {
      --column-width: 230px;
      --row-height: 28px;
    }
    &.lg {
      --column-width: 460px;
      --row-height: 42px;
    }

    .frame-left,
    .frame-right-col {
      display: flex;
      flex-flow: column;
      height: 100%;
      width: var(--column-width);
    }
    .frame-top-row,
    .frame-bottom-row {
      width: 100%;
      height: var(--row-height);
    }
    .frame-left-col :first-child {
      border-top-left-radius: 160px;
    }
    .frame-right-col :first-child {
      border-top-right-radius: 160px;
    }
    .content {
      min-height: 200px;
      min-width: 200px;
      padding: 16px;
      background-color: var(--background);
    }
  }
</style>
