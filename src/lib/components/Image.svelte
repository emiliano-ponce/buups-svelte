<script lang="ts">
    interface Props {
        src: string
        alt?: string
        position?: 'left' | 'right' | 'center'
        border?: boolean
        caption?: string
        class?: string
        [key: string]: any
    }

    let {
        src,
        alt = '',
        position = 'center',
        border = false,
        caption,
        class: className = '',
        ...rest
    }: Props = $props()

    const positionClass = position === 'left' ? 'pics-left' : position === 'right' ? 'pics-right' : 'pics'
</script>

<div class="{positionClass} {className}">
    <img {src} {alt} class:border {...rest} />
    {#if caption}
        <p class="caption">{caption}</p>
    {/if}
</div>

<style>
    .pics-right {
        float: right;
        margin-inline: 1rem;
        margin-bottom: 2rem;
        max-width: 500px;
        clear: both;
    }

    .pics-left {
        float: left;
        margin-inline: 1rem;
        margin-bottom: 2rem;
        max-width: 500px;
    }

    .pics {
        margin-block: 2rem;
        margin-inline: auto;
    }

    :global(.border),
    .border {
        border: 2px solid var(--font-color);
    }

    .caption {
        margin-top: -1rem;
        margin-bottom: 2.75rem;
        text-align: center;
        font-size: var(--sub-fonts);
    }

    .pics-right .caption,
    .pics-left .caption {
        margin-top: 1rem;
    }

    @media (max-width: 1060px) {
        .pics-right,
        .pics-left {
            float: none;
            margin-inline: auto;
        }

        .pics-right :global(img),
        .pics-left :global(img) {
            margin-inline: auto;
        }
    }
</style>
