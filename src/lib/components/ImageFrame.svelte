<script lang="ts">
    import type { Snippet } from 'svelte'

    interface Props {
        title: string
        children: Snippet
        src?: string
        alt?: string
        primaryColor?: string
        secondaryColor?: string
        accentColor?: string
        titleColor?: string
    }

    let {
        title,
        children,
        src,
        alt = '',
        primaryColor = 'var(--orange)',
        secondaryColor = 'var(--moonlit-violet)',
        accentColor = 'var(--almond-creme)',
        titleColor = 'var(--almond-creme)',
    }: Props = $props()
</script>

<div
    class="image-frame"
    style:--primary-color={primaryColor}
    style:--secondary-color={secondaryColor}
    style:--accent-color={accentColor}
    style:--title-color={titleColor}
>
    <div class="imgf-title">
        <div class="h4-wrapper">
            <h4>{title}</h4>
        </div>
    </div>

    <div class="imgf-image-body">
        <div class="image-holder">
            {#if src}
                <img {src} {alt} />
            {:else if children}
                {@render children()}
            {/if}
        </div>
    </div>

    <div class="imgf-base">
        <div class="imgf-block-1"></div>
        <div class="imgf-block-2"></div>
        <div class="imgf-block-3"></div>
        <div class="imgf-block-4"></div>
        <div class="imgf-block-5"></div>
    </div>
</div>

<style>
    .image-frame {
        display: block;
        margin: 2.75rem auto;
        width: fit-content;
        background: linear-gradient(var(--primary-color) 56%, var(--secondary-color) 44%);
        border-radius: 50px 25px 0 50px;
        position: relative;
    }

    .image-frame::before {
        content: '';
        display: block;
        width: 40px;
        height: 40px;
        background-color: black;
        position: absolute;
        right: 0;
        top: 0;
    }

    .image-frame::after {
        content: '';
        display: block;
        border-top: var(--spacers) solid black;
        border-bottom: var(--spacers) solid black;
        width: 45px;
        height: 80px;
        background-color: var(--secondary-color);
        position: absolute;
        left: 0;
        top: 56%;
    }

    .imgf-title {
        display: flex;
        justify-content: flex-end;
        height: 40px;
        border-right: 40px solid var(--secondary-color);
        border-radius: 25px 100vh 100vh 0;
        position: relative;
        z-index: 1;
        text-align: right;
    }

    .h4-wrapper {
        width: fit-content;
        height: var(--frame-height);
        background-color: black;
        border-right: var(--spacers) solid black;
    }

    .imgf-title h4 {
        margin-block: 0;
        width: fit-content;
        background-color: black;
        padding-left: var(--spacers);
        font-size: 2.05rem;
        color: var(--title-color);
        line-height: 40px;
        text-transform: uppercase;
    }

    .imgf-image-body {
        margin-left: 45px;
        background-color: black;
        width: fit-content;
        padding: 1rem;
        border-radius: 28px 0 0 28px;
    }

    .image-holder {
        width: fit-content;
        padding: 1rem;
        border: 2px solid var(--image-border-color);
        border-radius: 20px;
    }

    .imgf-base {
        display: grid;
        grid-template-columns: 20% 13% 35px 15% 1fr;
        margin-left: 80px;
        border-left: var(--spacers) solid black;
    }

    .imgf-block-1 {
        height: var(--frame-height);
        background-color: var(--accent-color);
        border-right: var(--spacers) solid black;
    }

    .imgf-block-2 {
        height: var(--frame-height);
        background-color: var(--secondary-color);
        border-right: var(--spacers) solid black;
    }

    .imgf-block-3 {
        height: var(--frame-height);
        background-color: black;
        border-right: 10px solid var(--secondary-color);
        border-left: 10px solid var(--accent-color);
    }

    .imgf-block-4 {
        height: var(--frame-height);
        background-color: var(--secondary-color);
        border-left: var(--spacers) solid black;
    }

    .imgf-block-5 {
        height: var(--frame-height);
        background-color: black;
    }

    @media (max-width: 750px) {
        .image-frame {
            border-radius: 40px 25px 0 40px;
        }

        .image-frame::after {
            width: 25px;
            height: 60px;
            top: 50%;
        }

        .imgf-title {
            height: 25px;
            border-right: 24px solid var(--secondary-color);
        }

        .h4-wrapper {
            width: fit-content;
            height: var(--frame-height);
            background-color: black;
        }

        .imgf-title h4 {
            font-size: 1.45rem;
        }

        .imgf-image-body {
            margin-left: 25px;
            padding: 0.75rem;
            border-radius: 20px 0 0 20px;
        }

        .image-holder {
            padding: 0.75rem;
            border-radius: 10px;
        }
    }

    @-moz-document url-prefix() {
        .imgf-title h4 {
            margin-top: -4px;
            margin-bottom: 0;
        }
    }
</style>
