<script lang="ts">
    import { formatScore } from '$lib/utils/seriesStats'

    interface Props {
        overall: number | null
        emiliano: number | null
        jars: number | null
        tmdbAvg: number | null | undefined
        tmdbCount?: number | null
    }
    let { overall, emiliano, jars, tmdbAvg, tmdbCount }: Props = $props()

    const stats = $derived([
        { label: 'Average', value: formatScore(overall), color: 'var(--orange)' },
        { label: 'Emiliano', value: formatScore(emiliano), color: 'var(--bluey)' },
        { label: 'Jars', value: formatScore(jars), color: 'var(--african-violet)' },
        {
            label: 'TMDB',
            value: formatScore(tmdbAvg),
            sub: tmdbCount ? `${tmdbCount.toLocaleString()} votes` : undefined,
            color: 'var(--butterscotch)',
        },
    ])
</script>

<div class="stat-grid" data-testid="stat-cards">
    {#each stats as stat (stat.label)}
        <div class="stat" style="--stat-color: {stat.color}">
            <span class="stat-label">{stat.label}</span>
            <span class="stat-value">{stat.value}</span>
            {#if stat.sub}<span class="stat-sub">{stat.sub}</span>{/if}
        </div>
    {/each}
</div>

<style>
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
    @media (max-width: 700px) {
        .stat-grid {
            grid-template-columns: 1fr 1fr;
        }
        .stat-value {
            font-size: 1.6rem;
        }
    }
</style>
