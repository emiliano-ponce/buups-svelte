<script lang="ts">
    interface ContentCardProps {
        title?: string
        subtitle?: string
        className?: string
        theme?: 'default' | 'primary' | 'secondary' | 'accent'
        variant?: 'full' | 'left' | 'right'
        children?: any
    }

    let { title, subtitle, className = '', variant = 'full', theme = 'default', children }: ContentCardProps = $props()

    const themes = {
        default: ['var(--bluey)', 'var(--african-violet)', 'var(--orange)', 'var(--butterscotch)', 'var(--red)'],
    }
    const themeValues: string[] = themes[theme]
</script>

<div
    class={`content-card ${className} variant-${variant}`}
    style={`
    --color-1: ${themeValues[0]};
    --color-2: ${themeValues[1]};
    --color-3: ${themeValues[2]};
    --color-4: ${themeValues[3]};
    --color-5: ${themeValues[4]};
`}
>
    <div class="flex flex-row">
        <div class="flex flex-col gap-1">
            
            <div class="l-bar-1"></div>
            <div class="l-bar-2"></div>
            <div class="bl-bar"></div>
        </div>
        <div class="flex flex-col flex-1">
            <div class="flex flex-row items-center gap-1">
                <div class="t-bar-2"></div>
                <h4 class="card-title">{title}</h4>
                <div class="t-bar-1"></div>
                <div class="t-bar-2"></div>
            </div>
            <div class="card-content">
                {@render children?.()}
            </div>
        </div>
    </div>
</div>

<style>
    .content-card {
        display: block;
        margin: 1.75rem auto;
        width: 100%;
        max-width: 1440px;
        border-radius: 25px;
        position: relative;
        padding: 1rem;
    }
    .tl-bar {
        height: 2rem;
        background: var(--color-1);
        border-top-left-radius: 25px;
        width: 12rem;
    }
    .t-bar-1 {
        height: 2rem;
        background: var(--color-2);
        flex: 1;
    }
    .t-bar-2 {
        height: 2rem;
        background: var(--color-3);
        flex: 1;
    }
    /* top left */
    .l-bar-1 {
        width: 1.5rem;
        background: var(--color-3);
        height: 4rem;
        border-top-left-radius: 25px;
        position: relative;
        &::before {
            content: '';
            display: block;
            width: 1.5rem;
            height: 1.5rem;
            background: linear-gradient(to bottom right, var(--color-3) 50%, var(--background) 50%);;
            position: absolute;
            top: 2rem;
            left: 1.5rem;
            z-index: 1;
        }
        &::after {
            content: '';
            display: block;
            width: 1.5rem;
            height: 1.5rem;
            background-color: var(--background);
            border-top-left-radius: 50%;
            position: absolute;
            top: 2rem;
            left: 1.5rem;
            z-index: 1;
        }
    }
    .l-bar-2 {
        width: 1.5rem;
        background: var(--color-5);
        flex: 1;
    }
    .bl-bar {
        background: var(--color-1);
        border-bottom-left-radius: 25px;
        width: 1.5rem;
        flex: 2;
    }

    .card-title {
        margin: 0;
        font-size: clamp(1.15rem, 1.05rem + 1.25vw, 1.875rem);
        font-weight: bold;
        color: white;
        text-transform: uppercase;
        text-align: right;
        /* background-color: black; */
        padding: 0 0.25rem;
        border-radius: 0 15px 15px 0;
        display: inline-block;
    }

    .card-subtitle {
        margin: 0;
        font-size: 0.875rem;
        color: var(--color-2);
        text-align: right;
        font-weight: bold;
        /* background-color: rgba(0, 0, 0, 0.7); */
        padding: 0 0.25rem;
        border-radius: 0 10px 10px 0;
        display: inline-block;
    }

    .card-content {
        /* background-color: black; */
        padding: 1.5rem;
        border-radius: 20px;
        color: var(--color-2);
        line-height: 1.6;
    }

    .card-content :global(p) {
        margin-block: 1rem;
        text-box: trim-both cap alphabetic;
    }

    .card-content :global(p:first-child) {
        margin-top: 0;
    }

    .card-content :global(p:last-child) {
        margin-bottom: 0;
    }

    .card-content :global(h1),
    .card-content :global(h2),
    .card-content :global(h3),
    .card-content :global(h4) {
        margin-block: 1.25rem;
        font-weight: normal;
        line-height: 1.2;
        text-transform: uppercase;
        text-box: trim-both cap alphabetic;
        color: var(--color-2);
    }

    .card-content :global(h1) {
        font-size: clamp(1.5rem, 1.25rem + 3.5vw, 4rem);
        text-align: right;
    }

    .card-content :global(h2) {
        font-size: clamp(1.4rem, 1.1rem + 2.25vw, 2.3rem);
    }

    .card-content :global(h3) {
        font-size: clamp(1.15rem, 1.05rem + 1.25vw, 1.875rem);
    }

    .card-content :global(h4) {
        font-size: clamp(1.025rem, 1rem + 1.125vw, 1.575rem);
    }

    .card-content :global(ul),
    .card-content :global(ol) {
        margin-block: 1rem;
        padding-left: 2rem;
    }

    .card-content :global(li) {
        margin-block: 0.5rem;
        text-box: trim-both cap alphabetic;
    }

    .card-content :global(blockquote) {
        margin-block: 1rem;
        margin-left: 1rem;
        padding-left: 1rem;
        position: relative;
        text-box: trim-both cap alphabetic;
        color: var(--color-2);
        font-style: italic;
    }

    .card-content :global(blockquote::before) {
        content: '';
        display: block;
        width: 4px;
        height: 100%;
        background-color: var(--color-2);
        border-radius: 2px;
        position: absolute;
        left: 0;
        top: 0;
    }

    .card-content :global(code) {
        font-family: monospace;
        font-size: 0.9rem;
        color: var(--orange);
        background-color: rgba(0, 0, 0, 0.5);
        padding: 0.125rem 0.25rem;
        border-radius: 3px;
    }

    .card-content :global(pre) {
        background-color: rgba(0, 0, 0, 0.8);
        padding: 1rem;
        border-radius: 8px;
        overflow-x: auto;
        margin-block: 1rem;
    }

    .card-content :global(pre code) {
        background: none;
        padding: 0;
    }

    /* Responsive adjustments */
    @media (max-width: 750px) {
        .content-card {
            margin: 1rem auto;
            padding: 0.75rem;
        }

        .card-content {
            margin-left: 15px;
            padding: 1rem;
        }

        .card-title {
            font-size: 1.25rem;
        }

        .card-subtitle {
            font-size: 0.8rem;
        }
    }

    @media (max-width: 525px) {
        .content-card {
            border-radius: 15px;
        }

        .content-card::before {
            width: 15px;
            height: 15px;
            border-radius: 15px;
        }

        .content-card::after {
            width: 15px;
            border-radius: 0 15px 15px 0;
        }

        .card-content {
            margin-left: 10px;
            padding: 0.75rem;
            border-radius: 15px;
        }

        .card-title {
            font-size: 1.1rem;
        }
    }
</style>
