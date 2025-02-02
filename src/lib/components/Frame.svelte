<script lang="ts">
  import { getRandomNumArr } from '$lib/utils/randomGenerator';
  import type { Snippet } from 'svelte';

  type FrameColor = 'red' | 'blue' | 'purple' | 'blue-light' | 'tan';
  type FrameVariant = 'full' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  type FrameSize = 'sm' | 'md' | 'lg';
  interface FrameProps {
    children: Snippet;
    size?: FrameSize;
    variant?: FrameVariant;
    cornerColor?: FrameColor;
  }
  let { variant = 'full', size = 'md', cornerColor = 'red', children }: FrameProps = $props();

  const colors: FrameColor[] = ['red', 'blue', 'purple', 'blue-light', 'tan'];
  const indices = getRandomNumArr(colors.findIndex((c) => c === cornerColor), 5, colors.length);

  let contentStyle =
    variant === 'full' ? `border-radius: 60px;` : `border-${variant}-radius: 60px;`;
  const shouldShow = (frameSide: 'top' | 'right' | 'bottom' | 'left') => {
    return variant === 'full' || variant.includes(frameSide);
  };
</script>

<div class="frame {size} {variant} flex">
  <div class="frame-left flex flex-col gap-0.5">
    <div class="bg-red flex-1"></div>
    <div class="bg-blue flex-1"></div>
    <div class="bg-purple flex-1"></div>
    <div class="bg-red flex-1"></div>
  </div>
  <div class="frame-middle flex flex-1 flex-col">
    {#if shouldShow('top')}<div class="frame-top flex gap-0.5">
        <div class="bg-red flex-1"></div>
        <div class="bg-blue flex-1"></div>
        <div class="bg-purple flex-1"></div>
        <div class="bg-red flex-1"></div>
      </div>{/if}
    <div class="content-wrap bg-red flex-1">
      <div class="content" style={contentStyle}>
        {@render children()}
      </div>
    </div>
    {#if shouldShow('bottom')}<div class="frame-bottom flex gap-0.5">
        <div class="bg-red flex-1"></div>
        <div class="bg-blue flex-1"></div>
        <div class="bg-purple flex-1"></div>
        <div class="bg-red flex-1"></div>
      </div>{/if}
  </div>
  {#if shouldShow('right')}<div class="frame-right flex flex-col gap-0.5">
      <div class="bg-red flex-1"></div>
      <div class="bg-blue flex-1"></div>
      <div class="bg-purple flex-1"></div>
      <div class="bg-red flex-1"></div>
    </div>{/if}
</div>

<style>
  .frame {
    height: 100%;
    width: 100%;
    min-height: 250px;
    min-width: 250px;

    --row-height: 28px;
    &.sm {
      --column-width: 28px;
    }
    &.md {
      --column-width: 160px;
    }
    &.lg {
      --column-width: 230px;
    }

    .frame-left,
    .frame-right {
      height: 100%;
      width: var(--column-width);
      overflow: hidden;
    }
    .frame-top,
    .frame-bottom {
      width: 100%;
      height: var(--row-height);
    }
    &.top-left,
    &.full {
      .frame-left {
        border-top-left-radius: 160px;
      }
    }
    &.top-right,
    &.full {
      .frame-right {
        border-top-right-radius: 160px;
      }
    }
    &.bottom-left,
    &.full {
      .frame-left {
        border-bottom-left-radius: 160px;
      }
    }
    &.bottom-right,
    &.full {
      .frame-right {
        border-bottom-right-radius: 160px;
      }
    }
    .frame-middle {
      flex: 1;
    }
    .content {
      height: 100%;
      min-height: 200px;
      min-width: 200px;
      padding: 16px;
      background-color: var(--background);
    }
  }
</style>
