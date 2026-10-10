<script lang="ts">
    import BeepLink from '$lib/components/BeepLink.svelte'
    import ContentCard from '$lib/components/ContentCard.svelte'
    import ReviewList from '$lib/components/ReviewList.svelte'
    import ScoreStats from '$lib/components/ScoreStats.svelte'
    import '$lib/components/series-page.css'
    import { episodeHref, seasonHref, seriesHref } from '$lib/utils/mediaRoutes'
    import { formatScore } from '$lib/utils/seriesStats'
    import type { PageProps } from './$types'

    let { data }: PageProps = $props()

    const s = $derived(data.series)
    const season = $derived(data.season)
    const totals = $derived(data.totals)

    const rankings = $derived(
        [
            { title: 'Top Rated', items: data.top, last: 'Average' },
            { title: 'Bottom Rated', items: data.bottom, last: 'Average' },
            { title: 'Disagreements', items: data.disagreements, last: 'Delta' },
        ].filter(r => r.items.length)
    )
</script>

<svelte:head>
    <title>{s.acronym} {season.title} · {s.title}</title>
</svelte:head>

<div class="media-page">
    <nav class="quick-nav" aria-label="Seasons">
        <BeepLink href={seriesHref(s.acronym)} class="back-link">{s.acronym}</BeepLink>
        {#each data.seasons as item (item.id)}
            <BeepLink
                href={seasonHref(s.acronym, item.number)}
                class={item.id === season.id ? 'current' : ''}
                current={item.id === season.id}
                title={item.title}
            >
                S{item.number}
            </BeepLink>
        {/each}
    </nav>

    <ContentCard title={season.title} subtitle={s.acronym}>
        <div class="header">
            {#if season.imageUrl}
                <img src={season.imageUrl} alt="{s.title} {season.title} poster" class="poster" />
            {/if}
            <div>
                <p class="overview">{season.overview || 'No overview available.'}</p>
                <p class="progress" data-testid="progress">
                    {totals.rated} of {totals.total} episodes reviewed
                </p>
                <p class="note">Part of <BeepLink href={seriesHref(s.acronym)}>{s.title}</BeepLink></p>
            </div>
        </div>
    </ContentCard>

    <ScoreStats
        overall={totals.overall}
        emiliano={totals.emiliano}
        jars={totals.jars}
        tmdbAvg={season.tmdb?.voteAvg}
        tmdbCount={season.tmdb?.voteCount}
    />

    <ContentCard title="Episodes" variant="left">
        <div class="table-wrap">
            <table data-testid="episode-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Episode</th>
                        <th class="th-emiliano">Emiliano</th>
                        <th class="th-jars">Jars</th>
                        <th>Average</th>
                        <th>TMDB</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.episodes as ep (ep.id)}
                        <tr>
                            <td>{ep.episode}</td>
                            <td>
                                <BeepLink href={episodeHref(s.acronym, season.number, ep.episode)}>{ep.title}</BeepLink>
                                <span class="muted">({ep.date})</span>
                            </td>
                            <td>{formatScore(ep.scores.emiliano)}</td>
                            <td>{formatScore(ep.scores.jars)}</td>
                            <td class="strong">{formatScore(ep.scores.overall)}</td>
                            <td>{formatScore(ep.tmdbAvg)}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </ContentCard>

    {#each rankings as r (r.title)}
        <ContentCard title={r.title} variant="left">
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Episode</th>
                            <th class="th-emiliano">Emiliano</th>
                            <th class="th-jars">Jars</th>
                            <th>{r.last}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each r.items as item, i (item.media.id)}
                            <tr>
                                <td>{i + 1}</td>
                                <td>
                                    <span class="muted">E{item.media.episode}</span>
                                    <BeepLink href={episodeHref(s.acronym, season.number, item.media.episode)}
                                        >{item.media.title}</BeepLink
                                    >
                                </td>
                                <td>{formatScore(item.scores.emiliano)}</td>
                                <td>{formatScore(item.scores.jars)}</td>
                                <td class="strong"
                                    >{formatScore('diff' in item ? (item.diff as number) : item.scores.overall)}</td
                                >
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </ContentCard>
    {/each}

    <h2 class="section-heading">Recent Reviews</h2>
    {#if data.recentReviews.length}
        <ReviewList reviews={data.recentReviews} />
    {:else}
        <p class="muted center">No reviews yet.</p>
    {/if}
</div>
