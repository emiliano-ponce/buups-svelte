<script lang="ts">
    import BeepLink from '$lib/components/BeepLink.svelte'
    import ContentCard from '$lib/components/ContentCard.svelte'
    import ReviewerScore from '$lib/components/ReviewerScore.svelte'
    import ReviewList from '$lib/components/ReviewList.svelte'
    import ScoreStats from '$lib/components/ScoreStats.svelte'
    import '$lib/components/series-page.css'
    import { episodeHref, seasonHref, seriesHref } from '$lib/utils/mediaRoutes'
    import type { PageProps } from './$types'

    let { data }: PageProps = $props()

    const s = $derived(data.series)
    const season = $derived(data.season)
    const ep = $derived(data.episode)

    const airDate = $derived(
        ep.date
            ? new Date(`${ep.date}T00:00:00`).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
              })
            : 'Unknown'
    )
</script>

<svelte:head>
    <title>{ep.title} · {s.acronym} S{season.number}E{ep.number}</title>
</svelte:head>

<div class="media-page">
    <nav class="quick-nav" aria-label="Breadcrumbs">
        <BeepLink href={seriesHref(s.acronym)} class="back-link">{s.acronym}</BeepLink>
        <BeepLink href={seasonHref(s.acronym, season.number)}>Season {season.number}</BeepLink>
        <BeepLink href={episodeHref(s.acronym, season.number, ep.number)} class="current" current
            >Episode {ep.number}</BeepLink
        >
    </nav>

    <ContentCard title={ep.title} subtitle="{s.acronym} · S{season.number}E{ep.number}">
        <div class="header">
            {#if ep.imageUrl}
                <img src={ep.imageUrl} alt="Still from {ep.title}" class="poster wide" />
            {/if}
            <div>
                <p class="progress" data-testid="air-date">Aired {airDate}</p>
                <p class="overview">{ep.overview || 'No overview available.'}</p>
                <p class="scores-line">
                    <ReviewerScore who="emiliano" score={data.scores.emiliano} />
                    <ReviewerScore who="jars" score={data.scores.jars} />
                </p>
            </div>
        </div>
    </ContentCard>

    <ScoreStats
        overall={data.scores.overall}
        emiliano={data.scores.emiliano}
        jars={data.scores.jars}
        tmdbAvg={ep.tmdb?.voteAvg}
        tmdbCount={ep.tmdb?.voteCount}
    />

    <nav class="prev-next" aria-label="Episode navigation">
        {#if data.prev}
            <BeepLink href={episodeHref(s.acronym, data.prev.season, data.prev.episode)} class="prev">
                <span class="dir">‹ S{data.prev.season}E{data.prev.episode}</span>
                <span>{data.prev.title}</span>
            </BeepLink>
        {:else}
            <span></span>
        {/if}
        {#if data.next}
            <BeepLink href={episodeHref(s.acronym, data.next.season, data.next.episode)} class="next">
                <span class="dir">S{data.next.season}E{data.next.episode} ›</span>
                <span>{data.next.title}</span>
            </BeepLink>
        {/if}
    </nav>

    <h2 class="section-heading">Reviews ({data.reviewCount})</h2>
    {#if data.reviews.length}
        <ReviewList reviews={data.reviews} />
    {:else}
        <p class="muted center">No reviews yet.</p>
    {/if}
</div>

<style>
    .scores-line {
        display: flex;
        gap: 0.75rem;
        margin-top: 0.75rem;
    }
    .prev-next {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }
    .prev-next :global(a) {
        display: flex;
        flex-direction: column;
        max-width: 48%;
    }
    .prev-next :global(a.next) {
        text-align: right;
        margin-left: auto;
    }
    .dir {
        color: var(--orange);
        text-transform: uppercase;
        font-size: 0.85rem;
    }
</style>
