<script lang="ts">
    import { getIsMobile } from '$lib/utils/global.svelte'
    import Bar from './Bar.svelte'

    interface ContentCardProps {
        title?: string
        className?: string
        theme?: 'default' | 'primary' | 'secondary' | 'accent'
        variant?: 'full' | 'left' | 'right'
        children?: any
    }

    let { title, className = '', variant = 'full', theme = 'default', children }: ContentCardProps = $props()

    const themes = {
        default: ['var(--bluey)', 'var(--african-violet)', 'var(--orange)', 'var(--butterscotch)', 'var(--red)'],
    }
    const themeValues: string[] = themes[theme]
    const baseThickness = 1
    const thickness = getIsMobile() ? '0.75rem' : `${baseThickness}rem`
    const thicknessLg = getIsMobile() ? '2rem' : `${baseThickness * 2.5}rem`

    let fontSize = $state('1.5rem')
    
    $effect(() => {
        if (title && getIsMobile()) {
            const titleLength = title.length
            if (titleLength > 25) {
                fontSize = '0.875rem'
            }
            else if (titleLength > 20) {
                fontSize = '1.15rem'
            } else if (titleLength > 15) {
                fontSize = '1.175rem'
            } else {
                fontSize = '1.5rem'
            }
        } else {
            fontSize = '1.5rem'
        }
    })

    const color = {
        topLeft: 0,
        bottomLeft: 1,
        bottomRight: 2,
        topRight: 3,
    } as const

    function getColor(role: keyof typeof color): string {
        const idx = color[role]
        return themeValues[idx] ?? themeValues[0]
    }
</script>

<div
    class={`content-card ${className} variant-${variant}`}
    style={`--bar-thickness: ${thickness}; --bar-thicknessLg: ${thicknessLg}`}
>
    <!-- Left Column -->
    <div class="flex flex-col gap-1">
        <Bar
            --thickness={thicknessLg}
            --thickness2={thickness}
            --size="5rem"
            --color={getColor('topLeft')}
            orientation="top-left"
        />
        <Bar --thickness={thicknessLg} --color={themeValues[4]} --flex="2" />
        <Bar --thickness={thicknessLg} --color={themeValues[3]} --flex="1" />
        <Bar
            --thickness={thicknessLg}
            --thickness2={thickness}
            --size="3rem"
            --color={getColor('bottomLeft')}
            orientation="bottom-left"
        />
    </div>
    <div class="flex flex-1 flex-col">
        <!-- Top Row -->
        <div class="flex flex-row items-center gap-1">
            <!-- First Bar must be the same color as top-left -->
            <Bar
                --thickness={thickness}
                --color={getColor('topLeft')}
                --size={getIsMobile() ? '2rem' : '5rem'}
                orientation="horizontal"
            />
            {#if title}
                <div class="card-title-wrapper">
                    <h2 style={`font-size: ${fontSize}`} class="card-title-shim">{title}</h2>
                    <h2 style={`font-size: ${fontSize}`} class="card-title">{title}</h2>
                </div>
            {/if}
            <Bar --thickness={thickness} --color={themeValues[1]} --flex="1" orientation="horizontal" />
            <Bar --thickness={thickness} --color={themeValues[0]} --flex="3" orientation="horizontal" />
            {#if !getIsMobile()}
                <Bar --thickness={thickness} --color={themeValues[3]} --flex="2" orientation="horizontal" />
                <!-- Last Bar must be the same color as top-right -->
                <Bar --thickness={thickness} --color={getColor('topRight')} --flex="1" orientation="horizontal" />
            {/if}
        </div>
        <div class="card-content">
            {@render children?.()}
        </div>
        <!-- Bottom Row -->
        <div class="mt-auto flex flex-row items-end gap-1">
            <!-- First Bar must be the same color as bottom-left -->
            <Bar --thickness={thickness} --color={getColor('bottomLeft')} --flex="1" orientation="horizontal" />
            <Bar --thickness={thickness} --color={themeValues[4]} --flex="3" orientation="horizontal" />
            <!-- Last Bar must be the same color as bottom-right -->
            <Bar --thickness={thickness} --color={getColor('bottomRight')} --flex="1" orientation="horizontal" />
        </div>
    </div>
    {#if !getIsMobile()}
        <!-- Right Column -->
        <div class="flex flex-col gap-1">
            <Bar
                --thickness={thicknessLg}
                --thickness2={thickness}
                --size="3rem"
                --color={getColor('topRight')}
                orientation="top-right"
            />
            <Bar --thickness={thicknessLg} --color={themeValues[1]} --flex="2" />
            <Bar --thickness={thicknessLg} --color={themeValues[4]} --flex="1" />
            <Bar --thickness={thicknessLg} --color={themeValues[0]} --flex="3" />
            <Bar
                --thickness={thicknessLg}
                --thickness2={thickness}
                --size="3rem"
                --color={getColor('bottomRight')}
                orientation="bottom-right"
            />
        </div>
    {/if}
</div>

<style>
    .content-card {
        display: flex;
        margin: 1.75rem auto;
        width: 100%;
        max-width: 1440px;
        border-radius: 25px;
        position: relative;
        padding: 1rem;
        min-height: 200px;
    }

    @media (max-width: 768px) {
        .content-card {
            padding: 0.5rem;
            padding-right: 0;
        }
    }

    .card-title-wrapper {
        padding: 0 0.25rem;
        display: inline-block;
        position: relative;
        height: var(--bar-thickness);
    }

    .card-title-shim,
    .card-title {
        margin: 0;
        font-weight: bold;
        text-transform: uppercase;
        text-align: right;
        white-space: nowrap;
    }

    .card-title-shim {
        color: transparent;
    }

    .card-title {
        color: white;
        position: absolute;
        bottom: 0;
    }

    .card-content {
        padding: 1.5rem var(--bar-thicknessLg, 1.5rem);
        border-radius: 20px;
        line-height: 1.6;
    }
</style>
