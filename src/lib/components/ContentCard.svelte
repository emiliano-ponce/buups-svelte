<script lang="ts">
    import { getIsMobile } from '$lib/utils/global.svelte'
    import type { Snippet } from 'svelte'
    import Bar from './Bar.svelte'

    interface ContentCardProps {
        title?: string
        subtitle?: string | Snippet
        className?: string
        theme?: 'default' | 'primary' | 'secondary' | 'accent'
        variant?: 'full' | 'left' | 'right' | 'sides'
        children?: any
        thickness?: number
    }

    let { title, subtitle, className = '', variant = 'full', theme = 'default', children, thickness: _thickness }: ContentCardProps = $props()

    const showSide = {
        left: ['full', 'left', 'sides'].includes(variant),
        right: ['full', 'right', 'sides'].includes(variant),
        top: ['full', 'left', 'right'].includes(variant),
        bottom: ['full', 'left', 'right'].includes(variant),
    }

    const themes = {
        default: ['var(--bluey)', 'var(--african-violet)', 'var(--orange)', 'var(--butterscotch)', 'var(--red)'],
    }
    const themeValues: string[] = themes[theme]
    const baseThickness = _thickness ?? 1
    const thickness = getIsMobile() ? '0.75rem' : `${baseThickness}rem`
    const thicknessLg = getIsMobile() ? '2rem' : `${baseThickness * 2.5}rem`

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

    const isSnippet = (value: any): value is Snippet => {
        return typeof value === 'function'
    }
</script>

<div
    class={`content-card ${className} variant-${variant}`}
    style={`--bar-thickness: ${thickness}; --bar-thicknessLg: ${thicknessLg}`}
>
    <!-- Left Column -->
    {#if showSide.left}
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
    {/if}
    <div class="flex flex-1 flex-col">
        <!-- Top Row -->
        <div class="flex flex-row items-center gap-1">
            <!-- First Bar must be the same color as top-left -->
            <Bar
                --thickness={thickness}
                --color={getColor('topLeft')}
                --size={getIsMobile() ? '2.5rem' : '5rem'}
                orientation="horizontal"
            />
            {#if title || subtitle}
                <div class="card-title-wrapper">
                    <div class="title-shim">
                        {#if subtitle}
                            {#if typeof subtitle === 'string'}
                                <h3 class="subtitle">{subtitle}</h3>
                            {:else if isSnippet(subtitle)}
                                <div class="subtitle">{@render subtitle()}</div>
                            {/if}
                        {/if}
                        {#if title}
                            <h2 class="title">{title}</h2>
                        {/if}
                    </div>
                    <div class="title-wrapper">
                        {#if subtitle}
                            {#if typeof subtitle === 'string'}
                                <h3 class="subtitle">{subtitle}</h3>
                            {:else if isSnippet(subtitle)}
                                <div class="subtitle">{@render subtitle()}</div>
                            {/if}
                        {/if}
                        {#if title}
                            <h2 class="title">{title}</h2>
                        {/if}
                    </div>
                </div>
            {/if}
            {#if showSide.top}
                <Bar --thickness={thickness} --color={themeValues[1]} --flex="1" orientation="horizontal" />
                <Bar --thickness={thickness} --color={themeValues[0]} --flex="3" orientation="horizontal" />
            {/if}
            {#if !getIsMobile()}
                {#if showSide.top}
                    <Bar --thickness={thickness} --color={themeValues[3]} --flex="2" orientation="horizontal" />
                {/if}
                <!-- Last Bar must be the same color as top-right -->
                <Bar
                    --thickness={thickness}
                    --color={getColor('topRight')}
                    --flex={showSide.top ? '1' : 'unset'}
                    --size={showSide.top ? 'unset' : '5rem'}
                    className="ml-auto"
                    orientation="horizontal"
                />
            {/if}
        </div>
        <div class="card-content">
            {@render children?.()}
        </div>
        <!-- Bottom Row -->
        <div class="flex flex-row items-end gap-1">
            <!-- First Bar must be the same color as bottom-left -->
            <Bar
                --thickness={thickness}
                --color={getColor('bottomLeft')}
                --flex={showSide.top ? '1' : 'unset'}
                --size={showSide.top ? 'unset' : '5rem'}
                orientation="horizontal"
            />
            {#if showSide.bottom}
                <Bar --thickness={thickness} --color={themeValues[4]} --flex="3" orientation="horizontal" />
            {/if}
            <!-- Last Bar must be the same color as bottom-right -->
            <Bar
                --thickness={thickness}
                --color={getColor('bottomRight')}
                --flex={showSide.top ? '1' : 'unset'}
                --size={showSide.top ? 'unset' : '5rem'}
                className="ml-auto"
                orientation="horizontal"
            />
        </div>
    </div>
    {#if !getIsMobile() && showSide.right}
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
        margin: 0 auto;
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

    .title-shim,
    .title-wrapper {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .title-shim {
        opacity: 0;
        pointer-events: none;
    }

    .title-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .title {
        font-size: 1.75rem;
        color: white;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .subtitle {
        font-size: 1.25rem;
        color: var(--link-color);
    }

    @media (max-width: 768px) {
        .title-shim,
        .title-wrapper {
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }
        .title {
            font-size: 1.25rem;
            max-width: 185px;
        }
        .subtitle {
            font-size: 0.875rem;
        }
    }

    .card-content {
        padding: 1.5rem var(--bar-thicknessLg, 1.5rem);
        border-radius: 20px;
        line-height: 1.6;
        margin: auto 0;
    }
</style>
