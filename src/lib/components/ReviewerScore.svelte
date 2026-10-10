<script lang="ts">
    import { formatScore } from '$lib/utils/seriesStats'

    interface Props {
        who: 'emiliano' | 'jars'
        score: number | null | undefined
    }
    let { who, score }: Props = $props()

    const meta = {
        emiliano: { short: 'E', name: 'Emiliano', color: 'var(--bluey)' },
        jars: { short: 'J', name: 'Jars', color: 'var(--african-violet)' },
    } as const
    const m = $derived(meta[who])
</script>

<span class="reviewer-score" title="{m.name}: {formatScore(score)}" aria-label="{m.name}: {formatScore(score)}">
    <span class="badge" style="--badge-color: {m.color}" aria-hidden="true">{m.short}</span>
    <span class="value" aria-hidden="true">{formatScore(score)}</span>
</span>

<style>
    .reviewer-score {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        white-space: nowrap;
    }
    .badge {
        display: inline-block;
        min-width: 1.25rem;
        padding: 0 0.35rem;
        border-radius: 100vmax;
        background: var(--badge-color);
        color: black;
        font-size: 0.75rem;
        font-weight: bold;
        line-height: 1.25rem;
        text-align: center;
    }
    .value {
        color: var(--butterscotch);
    }
</style>
