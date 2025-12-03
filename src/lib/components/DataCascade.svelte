<script lang="ts">
    type CascadeData = string[][]

    interface Props {
        data: CascadeData
        frozen?: boolean
        class?: string
    }

    let { data, frozen = false, class: className = '' }: Props = $props()
</script>

<div class="data-cascade-wrapper {className}" id={frozen ? 'frozen' : 'default'}>
    {#each data as column}
        <div class="data-column">
            {#each column as cell, i}
                <div data-cascade-row class="dc-row-{i + 1}">
                    {cell}
                </div>
            {/each}
        </div>
    {/each}
</div>

<style>
    .data-cascade-wrapper {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        max-width: 100%;
        height: calc(var(--dc-row-height) * 9);
        overflow: hidden;
        padding-right: 0.5rem;
        padding-left: clamp(20px, 3vw, 50px);
        column-gap: 0.5rem;
    }

    .data-column {
        display: grid;
        grid-template-columns: 1fr;
        margin-top: 4px;
        text-align: right;
        font-size: var(--dc-font-size);
        line-height: 1;
        color: black;
    }

    .data-column > div {
        text-box: trim-both cap alphabetic;
        height: var(--dc-row-height);
    }

    @media (max-width: 780px) {
        .data-cascade-wrapper {
            display: none;
        }
    }

    @keyframes colored-blink {
        0% {
            color: var(--light-color);
        }
        15% {
            color: var(--data-blink-color);
        }
        25% {
            color: var(--data-blink-color);
        }
        50% {
            color: var(--data-blink-color);
        }
        75% {
            color: var(--data-blink-color);
        }
        80% {
            color: var(--background-color);
        }
        90% {
            color: var(--background-color);
        }
        100% {
            color: var(--background-color);
        }
    }

    [data-cascade-row] {
        animation: colored-blink 4s infinite;
    }

    .dc-row-1 {
        animation-delay: 1s;
    }
    .dc-row-2 {
        animation-delay: 1.2s;
    }
    .dc-row-3 {
        animation-delay: 1.4s;
    }
    .dc-row-4 {
        animation-delay: 1.6s;
    }
    .dc-row-5 {
        animation-delay: 1.8s;
    }
    .dc-row-6 {
        animation-delay: 2s;
    }
    .dc-row-7 {
        animation-delay: 2.2s;
    }
    .dc-row-8 {
        animation-delay: 2.4s;
    }
    .dc-row-9 {
        animation-delay: 2.6s;
    }

    /* Static data cascade */
    .data-cascade-wrapper#frozen [data-cascade-row] {
        animation: none;
    }

    .data-cascade-wrapper#frozen .dc-row-1,
    .data-cascade-wrapper#frozen .dc-row-2,
    .data-cascade-wrapper#frozen .dc-row-3,
    .data-cascade-wrapper#frozen .dc-row-4 {
        color: var(--orange);
    }

    .data-cascade-wrapper#frozen .dc-row-5,
    .data-cascade-wrapper#frozen .dc-row-6,
    .data-cascade-wrapper#frozen .dc-row-7 {
        color: var(--light-color);
    }
</style>
