<script lang="ts">
    import ContentCard from '$lib/components/ContentCard.svelte'
    import ReviewerScore from '$lib/components/ReviewerScore.svelte'
    import SeriesLink from '$lib/components/SeriesLink.svelte'
    import { formatScore } from '$lib/utils/seriesStats'
    import { tmdbImageSize } from '$lib/utils/tmdbImage'
    import type { PageProps } from './$types'

    let { data }: PageProps = $props()

    const truncate = (text: string, max = 220) =>
        text.length <= max ? text : `${text.slice(0, text.lastIndexOf(' ', max)).trimEnd()}…`
</script>

<svelte:head>
    <title>Series · Buups</title>
</svelte:head>

<div class="series-index">
    <h2 class="heading">Series</h2>
    <div class="grid" data-testid="series-grid">
        {#each data.series as s (s.id)}
            <SeriesLink acronym={s.acronym} class="series-card-link" title="View {s.title}">
                <ContentCard title={s.title} subtitle={s.acronym} variant="left">
                    <div class="body">
                        {#if s.imageUrl}
                            <img src={tmdbImageSize(s.imageUrl, 'w185')} alt="" class="poster" loading="lazy" />
                        {/if}
                        <div class="text">
                            <p class="overview">{truncate(s.overview, 320)}</p>
                            <div class="scores">
                                <span class="overall" title="Overall average"
                                    >Overall <strong>{formatScore(s.scores.overall)}</strong></span
                                >
                                <ReviewerScore who="emiliano" score={s.scores.emiliano} />
                                <ReviewerScore who="jars" score={s.scores.jars} />
                                <span class="tmdb" title="TMDB rating">TMDB {formatScore(s.tmdb?.voteAvg)}</span>
                            </div>
                            <p class="progress">{s.scores.rated} of {s.scores.total} episodes reviewed</p>
                        </div>
                    </div>
                </ContentCard>
            </SeriesLink>
        {/each}
    </div>
</div>

<style>
    .series-index {
        max-width: var(--max-width);
        margin: 0 auto;
        padding-bottom: 4rem;
    }
    .heading {
        color: var(--orange);
        text-transform: uppercase;
    }
    .grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 1rem;
    }
    .grid :global(.series-card-link) {
        display: block;
        min-width: 0;
        color: inherit;
        text-decoration: none;
        transition: filter 0.15s;
    }
    .grid :global(.series-card-link:hover),
    .grid :global(.series-card-link:focus-visible) {
        filter: brightness(1.2);
    }
    .body {
        display: flex;
        gap: 0.75rem;
    }
    .poster {
        width: 92px;
        height: 138px;
        object-fit: cover;
        flex-shrink: 0;
    }
    .overview {
        color: var(--banner-color);
        font-size: 0.9rem;
    }
    .scores {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 0.9rem;
        margin-top: 0.5rem;
        align-items: center;
        text-transform: uppercase;
        font-size: 0.85rem;
    }
    .overall,
    .tmdb {
        color: var(--orange);
    }
    .overall strong {
        color: var(--butterscotch);
    }
    .progress {
        margin-top: 0.35rem;
        font-size: 0.8rem;
        color: var(--orange);
        opacity: 0.85;
        text-transform: uppercase;
    }
    @media (max-width: 700px) {
        .body {
            flex-direction: column;
        }
        .poster {
            width: 64px;
            height: 96px;
        }
    }
</style>
