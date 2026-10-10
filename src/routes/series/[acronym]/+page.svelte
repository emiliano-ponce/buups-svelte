<script lang="ts">
    import { resolve } from '$app/paths'
    import ContentCard from '$lib/components/ContentCard.svelte'
    import ReviewList from '$lib/components/ReviewList.svelte'
    import SeriesLink from '$lib/components/SeriesLink.svelte'
    import { playSound } from '$lib/utils/audioHelpers'
    import { formatScore } from '$lib/utils/seriesStats'
    import { tmdbImageSize } from '$lib/utils/tmdbImage'
    import type { PageProps } from './$types'

    let { data }: PageProps = $props()

    const s = $derived(data.series)
    const totals = $derived(data.totals)

    const label = (m: { type: string; seasonNumber: number | null; episode: number }) =>
        m.type === 'movie'
            ? `Movie ${m.episode}`
            : m.seasonNumber !== null
              ? `S${m.seasonNumber}E${m.episode}`
              : 'Special'

    const stats = $derived([
        { label: 'Average', value: formatScore(totals.overall), color: 'var(--orange)' },
        { label: 'Emiliano', value: formatScore(totals.emiliano), color: 'var(--bluey)' },
        { label: 'Jars', value: formatScore(totals.jars), color: 'var(--african-violet)' },
        {
            label: 'TMDB',
            value: formatScore(s.tmdb?.voteAvg),
            sub: s.tmdb?.voteCount ? `${s.tmdb.voteCount.toLocaleString()} votes` : undefined,
            color: 'var(--butterscotch)',
        },
    ])
</script>

<svelte:head>
    <title>{s.acronym} · {s.title}</title>
</svelte:head>

<div class="series-page">
    <nav class="quick-nav" aria-label="Series">
        <a href={resolve('/series', {})} class="all-link" onclick={() => playSound('beep1', 'buttons')}>All Series</a>
        {#each data.seriesList as item (item.id)}
            <SeriesLink
                acronym={item.acronym}
                class="quick-link {item.id === s.id ? 'current' : ''}"
                current={item.id === s.id}
                title={item.title}
            >
                {#if item.imageUrl}
                    <img src={tmdbImageSize(item.imageUrl, 'w92')} alt="" />
                {/if}
                <span>{item.acronym}</span>
            </SeriesLink>
        {/each}
    </nav>

    <ContentCard title={s.title} subtitle={s.acronym}>
        <div class="header">
            {#if s.imageUrl}
                <img src={s.imageUrl} alt="{s.title} poster" class="poster" />
            {/if}
            <div class="header-body">
                <p class="overview">{s.overview}</p>
                <p class="progress" data-testid="progress">
                    {totals.rated} of {totals.total} episodes reviewed
                </p>
            </div>
        </div>
    </ContentCard>

    <div class="stat-grid" data-testid="stat-cards">
        {#each stats as stat (stat.label)}
            <div class="stat" style="--stat-color: {stat.color}">
                <span class="stat-label">{stat.label}</span>
                <span class="stat-value">{stat.value}</span>
                {#if stat.sub}<span class="stat-sub">{stat.sub}</span>{/if}
            </div>
        {/each}
    </div>

    {#if data.seasons.length}
        <ContentCard title="Seasons" variant="left">
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Season</th>
                            <th>Reviewed</th>
                            <th class="th-emiliano">Emiliano</th>
                            <th class="th-jars">Jars</th>
                            <th>Average</th>
                            <th>TMDB</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each data.seasons as season (season.id)}
                            <tr>
                                <td>{season.title}</td>
                                <td>{season.rated}/{season.total}</td>
                                <td>{formatScore(season.emiliano)}</td>
                                <td>{formatScore(season.jars)}</td>
                                <td class="strong">{formatScore(season.overall)}</td>
                                <td>{formatScore(season.tmdbAvg)}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </ContentCard>
    {/if}

    {#if data.movies.length}
        <ContentCard title="Movies" variant="left">
            <p class="muted note">Not included in series averages.</p>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Movie</th>
                            <th class="th-emiliano">Emiliano</th>
                            <th class="th-jars">Jars</th>
                            <th>Average</th>
                            <th>TMDB</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each data.movies as movie (movie.id)}
                            <tr>
                                <td>{movie.title} <span class="muted">({movie.date.slice(0, 4)})</span></td>
                                <td>{formatScore(movie.scores.emiliano)}</td>
                                <td>{formatScore(movie.scores.jars)}</td>
                                <td class="strong">{formatScore(movie.scores.overall)}</td>
                                <td>{formatScore(movie.tmdbAvg)}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </ContentCard>
    {/if}

    {#if data.top.length}
        <ContentCard title="Top Rated" variant="left">
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Episode</th>
                            <th class="th-emiliano">Emiliano</th>
                            <th class="th-jars">Jars</th>
                            <th>Average</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each data.top as item, i (item.media.id)}
                            <tr>
                                <td>{i + 1}</td>
                                <td><span class="muted">{label(item.media)}</span> {item.media.title}</td>
                                <td>{formatScore(item.scores.emiliano)}</td>
                                <td>{formatScore(item.scores.jars)}</td>
                                <td class="strong">{formatScore(item.scores.overall)}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </ContentCard>
    {/if}

    {#if data.bottom.length}
        <ContentCard title="Bottom Rated" variant="left">
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Episode</th>
                            <th class="th-emiliano">Emiliano</th>
                            <th class="th-jars">Jars</th>
                            <th>Average</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each data.bottom as item, i (item.media.id)}
                            <tr>
                                <td>{i + 1}</td>
                                <td><span class="muted">{label(item.media)}</span> {item.media.title}</td>
                                <td>{formatScore(item.scores.emiliano)}</td>
                                <td>{formatScore(item.scores.jars)}</td>
                                <td class="strong">{formatScore(item.scores.overall)}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </ContentCard>
    {/if}

    {#if data.disagreements.length}
        <ContentCard title="Disagreements" variant="left">
            <p class="muted note">Biggest gaps between Emiliano and Jars.</p>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Episode</th>
                            <th class="th-emiliano">Emiliano</th>
                            <th class="th-jars">Jars</th>
                            <th>Delta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each data.disagreements as item, i (item.media.id)}
                            <tr>
                                <td>{i + 1}</td>
                                <td><span class="muted">{label(item.media)}</span> {item.media.title}</td>
                                <td>{formatScore(item.scores.emiliano)}</td>
                                <td>{formatScore(item.scores.jars)}</td>
                                <td class="strong">{formatScore(item.diff)}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </ContentCard>
    {/if}

    <h2 class="section-heading">Recent Reviews</h2>
    {#if data.recentReviews.length}
        <ReviewList reviews={data.recentReviews} />
    {:else}
        <p class="muted center">No reviews yet.</p>
    {/if}
</div>

<style>
    .series-page {
        max-width: var(--max-width);
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-bottom: 4rem;
    }
    .header {
        display: flex;
        gap: 1rem;
    }
    .poster {
        width: 180px;
        height: auto;
        object-fit: cover;
        align-self: flex-start;
    }
    .overview {
        color: var(--banner-color);
    }
    .progress {
        margin-top: 0.75rem;
        color: var(--orange);
        text-transform: uppercase;
    }
    .stat-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.5rem;
    }
    .stat {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        padding: 0.5rem 1rem;
        border-radius: 0 2rem 2rem 0;
        background: var(--stat-color);
        color: black;
        text-transform: uppercase;
    }
    .stat-label {
        font-size: 0.9rem;
    }
    .stat-value {
        font-size: 2.2rem;
        line-height: 1;
    }
    .stat-sub {
        font-size: 0.75rem;
    }
    .table-wrap {
        overflow-x: auto;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th {
        text-align: left;
        color: var(--orange);
        text-transform: uppercase;
        font-weight: normal;
        padding: 0.25rem 0.5rem;
    }
    td {
        color: var(--banner-color);
        padding: 0.25rem 0.5rem;
        border-top: 1px solid color-mix(in srgb, var(--african-violet) 40%, transparent);
    }
    .th-emiliano {
        color: var(--bluey);
    }
    .th-jars {
        color: var(--african-violet);
    }
    .strong {
        color: var(--butterscotch);
    }
    .muted {
        opacity: 0.7;
    }
    .note {
        color: var(--banner-color);
        margin-bottom: 0.5rem;
    }
    .center {
        text-align: center;
    }
    .quick-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        align-items: center;
    }
    .quick-nav :global(a) {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        height: 2.25rem;
        padding: 0 0.85rem 0 0.25rem;
        border-radius: 100vmax;
        background: var(--african-violet);
        color: black;
        text-decoration: none;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 0.85rem;
    }
    .quick-nav :global(a img) {
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 50%;
        object-fit: cover;
    }
    .quick-nav :global(a.all-link) {
        background: var(--orange);
        padding-left: 0.85rem;
    }
    .quick-nav :global(a.current) {
        background: var(--butterscotch);
        outline: 2px solid var(--orange);
        outline-offset: 2px;
    }
    .quick-nav :global(a:hover),
    .quick-nav :global(a:focus-visible) {
        filter: brightness(1.15);
    }
    .section-heading {
        color: var(--orange);
        text-transform: uppercase;
    }
    @media (max-width: 700px) {
        .header {
            flex-direction: column;
        }
        .poster {
            width: 120px;
        }
        .stat-grid {
            grid-template-columns: 1fr 1fr;
        }
        .stat-value {
            font-size: 1.6rem;
        }
    }
</style>
