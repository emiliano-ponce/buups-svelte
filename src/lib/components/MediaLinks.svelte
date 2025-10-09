<script lang="ts">
    interface MediaLinksProps {
        breadcrumbs: { label: string; href: string }[]
    }

    let { breadcrumbs }: MediaLinksProps = $props()
</script>

<div class="media-links">
    {#each breadcrumbs as crumb, i}
        {#if i > 0}<span class="separator"></span>{/if}
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

    .media-links a {
        color: inherit;
        text-decoration: none;
        transition: color 0.2s ease;
    }

    .media-links a:hover {
        color: inherit;
    }

    .separator {
        vertical-align: middle;
        margin: 0 0.25em;
        height: 0.5em;
        width: 0.5em;
        background-color: var(--link-color);
        border-radius: 100%;
        display: inline-block;
    }
</style>