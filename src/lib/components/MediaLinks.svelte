<script lang="ts">
    interface MediaLinksProps {
        breadcrumbs: { label: string; href: string }[]
    }

    let { breadcrumbs }: MediaLinksProps = $props()
</script>

<div class="media-links">
    {#each breadcrumbs as crumb, i}
        {#if i > 0}<span class="separator">›</span>{/if}
        <a href={crumb.href}>{crumb.label}</a>
    {/each}
</div>

<style>
    .media-links {
        display: inline;
        font-weight: 600;
        text-transform: uppercase;
        text-align: right;
        white-space: nowrap;
        font-size: inherit;
        margin: 0;
    }

    .media-links {
        color: rgba(255, 255, 255, 0.7);
    }

    .media-links a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        transition: color 0.2s ease;
    }

    .media-links a:hover {
        color: white;
    }

    .separator {
        margin: 0 0.35rem;
        color: rgba(255, 255, 255, 0.5);
    }
</style>