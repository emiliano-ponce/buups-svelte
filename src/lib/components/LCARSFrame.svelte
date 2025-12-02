<script lang="ts">
    import type { Snippet } from 'svelte'

    interface Props {
        children?: Snippet
        frameColor?: string
    }

    let { children, frameColor = 'var(--african-violet)' }: Props = $props()
</script>

<div class="lcars-frame" style="--frame-color: {frameColor}">
    <div class="frame-col-1">
        <div class="frame-col-1-cell-a"></div>
        <div class="frame-col-1-cell-b"></div>
        <div class="frame-col-1-cell-c"></div>
    </div>

    <div class="frame-col-2"></div>

    <div class="frame-col-3">
        {#if children}
            {@render children()}
        {/if}
    </div>

    <div class="frame-col-4"></div>

    <div class="frame-col-5">
        <div class="frame-col-5-cell-a"></div>
        <div class="frame-col-5-cell-b"></div>
        <div class="frame-col-5-cell-c"></div>
    </div>
</div>

<style>
    .lcars-frame {
        display: flex;
        min-height: 280px;
        position: relative;
        --frame-color: var(--african-violet);
    }

    .frame-col-1 {
        width: 20px;
        height: 280px;
        background: var(--frame-color);
        border-radius: 16px 0 0 16px;
        position: relative;
    }

    .frame-col-1:before {
        content: '';
        display: block;
        width: 20px;
        height: 200px;
        border-top: 5px solid black;
        border-bottom: 5px solid black;
        background-color: var(--frame-color);
        position: absolute;
        top: 40px;
        left: 0;
    }

    .frame-col-1-cell-a {
        width: 14px;
        height: 65px;
        background-color: var(--tomato);
        border-left: 4px solid black;
        border-bottom: 4px solid black;
        position: absolute;
        top: 45px;
        right: 0;
        z-index: 2;
    }

    .frame-col-1-cell-b {
        width: 14px;
        height: 70px;
        background-color: var(--bluey);
        border-left: 4px solid black;
        position: absolute;
        top: 110px;
        right: 0;
        z-index: 2;
    }

    .frame-col-1-cell-c {
        width: 14px;
        height: 65px;
        background-color: var(--orange);
        border-top: 4px solid black;
        border-left: 4px solid black;
        position: absolute;
        bottom: 45px;
        right: 0;
        z-index: 2;
    }

    .frame-col-2 {
        width: 20px;
        height: 280px;
        background-color: var(--frame-color);
        position: relative;
    }

    .frame-col-2:before {
        content: '';
        display: block;
        width: 20px;
        height: 240px;
        background-color: black;
        border-radius: 10px 0 0 10px;
        position: absolute;
        top: 20px;
        left: 0;
    }

    .frame-col-3 {
        display: flex;
        width: 240px;
        height: 280px;
        align-items: center;
        justify-content: center;
    }

    .frame-col-4 {
        width: 20px;
        height: 280px;
        background-color: var(--frame-color);
        position: relative;
    }

    .frame-col-4:before {
        content: '';
        display: block;
        width: 20px;
        height: 240px;
        background-color: black;
        border-radius: 0 10px 10px 0;
        position: absolute;
        top: 20px;
        left: 0;
    }

    .frame-col-5 {
        width: 20px;
        height: 280px;
        background-color: var(--frame-color);
        border-radius: 0 16px 16px 0;
        padding-top: 40px;
        position: relative;
    }

    .frame-col-5:before {
        content: '';
        display: block;
        width: 20px;
        height: 200px;
        border-top: 5px solid black;
        border-bottom: 5px solid black;
        background-color: var(--frame-color);
    }

    .frame-col-5-cell-a {
        width: 14px;
        height: 65px;
        background-color: var(--lilac);
        border-bottom: 4px solid black;
        border-right: 4px solid black;
        position: absolute;
        top: 45px;
        left: 0;
        z-index: 2;
    }

    .frame-col-5-cell-b {
        width: 14px;
        height: 70px;
        background-color: var(--violet-creme);
        border-right: 4px solid black;
        position: absolute;
        top: 110px;
        left: 0;
        z-index: 2;
    }

    .frame-col-5-cell-c {
        width: 14px;
        height: 65px;
        background-color: var(--moonlit-violet);
        border-top: 4px solid black;
        border-right: 4px solid black;
        position: absolute;
        bottom: 45px;
        left: 0;
        z-index: 2;
    }
</style>
