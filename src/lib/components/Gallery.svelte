<script lang="ts">
    interface GalleryItem {
        src: string
        alt?: string
        caption?: string
        href?: string
    }

    interface Props {
        items: GalleryItem[]
        thumbs?: boolean
        class?: string
    }

    let { items, thumbs = false, class: className = '' }: Props = $props()
</script>

<ul class="gallery {className}" class:thumbs>
    {#each items as item}
        <li>
            {#if item.href}
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <img src={item.src} alt={item.alt || ''} />
                </a>
            {:else}
                <img src={item.src} alt={item.alt || ''} />
            {/if}
            {#if item.caption}
                <div>{item.caption}</div>
            {/if}
        </li>
    {/each}
</ul>

<style>
    .gallery {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.75rem;
        list-style: none;
        text-align: center;
        font-size: 0.875rem;
        margin: 0;
        padding: 0;
    }

    .gallery img {
        align-self: flex-start;
        border: 4px solid black;
    }

    .gallery li div {
        padding-block: 0.6rem;
        text-box: trim-both cap alphabetic;
    }

    .thumbs img {
        width: 340px;
    }

    .gallery a {
        align-self: flex-start;
    }

    .gallery a img:hover {
        border-color: var(--font-color);
    }
</style>
