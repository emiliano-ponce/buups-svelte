<script lang="ts">
    interface ContentCardProps {
        title?: string;
        subtitle?: string;
        className?: string;
        variant?: 'default' | 'primary' | 'secondary' | 'accent';
        children?: any;
    }

    let { 
        title, 
        subtitle, 
        className = '', 
        variant = 'default',
        children 
    }: ContentCardProps = $props();

    // Color variants based on LCARS color scheme
    const variants = {
        default: {
            frame: 'var(--african-violet)',
            accent: 'var(--orange)',
            bg: 'var(--background-color)'
        },
        primary: {
            frame: 'var(--bluey)',
            accent: 'var(--african-violet)',
            bg: 'var(--background-color)'
        },
        secondary: {
            frame: 'var(--orange)',
            accent: 'var(--butterscotch)',
            bg: 'var(--background-color)'
        },
        accent: {
            frame: 'var(--red)',
            accent: 'var(--african-violet)',
            bg: 'var(--background-color)'
        }
    };

    const currentVariant = variants[variant];
</script>

<div class="content-card {className}" style="--frame-color: {currentVariant.frame}; --accent-color: {currentVariant.accent}">
    {#if title || subtitle}
        <div class="card-header">
            {#if title}
                <h3 class="card-title">{title}</h3>
            {/if}
            {#if subtitle}
                <p class="card-subtitle">{subtitle}</p>
            {/if}
        </div>
    {/if}
    
    <div class="card-content">
        {@render children?.()}
    </div>
</div>

<style>
    .content-card {
        display: block;
        margin: 1.75rem auto;
        width: fit-content;
        max-width: 100%;
        background: var(--frame-color);
        border-radius: 25px 0 0 25px;
        position: relative;
        padding: 1rem;
        border: 2px solid var(--frame-color);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .content-card::before {
        content: '';
        display: block;
        width: 20px;
        height: 20px;
        background-color: black;
        position: absolute;
        right: 0;
        top: 0;
        border-radius: 0 25px 0 0;
    }

    .content-card::after {
        content: '';
        display: block;
        width: 20px;
        height: 100%;
        background-color: var(--accent-color);
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 25px 0 0 25px;
    }

    .card-header {
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--accent-color);
    }

    .card-title {
        margin: 0 0 0.5rem 0;
        font-size: clamp(1.15rem, 1.05rem + 1.25vw, 1.875rem);
        font-weight: bold;
        color: white;
        text-transform: uppercase;
        text-align: right;
        background-color: black;
        padding: 0.25rem 0.5rem;
        border-radius: 0 15px 15px 0;
        display: inline-block;
    }

    .card-subtitle {
        margin: 0.5rem 0 0 0;
        font-size: 0.875rem;
        color: var(--accent-color);
        text-align: right;
        font-weight: bold;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 0.25rem 0.5rem;
        border-radius: 0 10px 10px 0;
        display: inline-block;
    }

    .card-content {
        background-color: black;
        padding: 1.5rem;
        border-radius: 20px 0 0 20px;
        margin-left: 20px;
        color: var(--font-color);
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
        color: var(--accent-color);
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
        color: var(--accent-color);
        font-style: italic;
    }

    .card-content :global(blockquote::before) {
        content: '';
        display: block;
        width: 4px;
        height: 100%;
        background-color: var(--accent-color);
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
            border-radius: 15px 0 0 15px;
        }

        .card-content {
            margin-left: 10px;
            padding: 0.75rem;
        }

        .card-title {
            font-size: 1.1rem;
        }
    }
</style>