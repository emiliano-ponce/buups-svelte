<script lang="ts">
    import { settings } from '$lib/utils/settings.svelte'
    
    let { open = $bindable(false) } = $props()
    let popoverElement: HTMLDivElement | null = $state(null)
    let buttonElement: HTMLButtonElement | null = $state(null)
    
    function handleVolumeChange(e: Event) {
        const target = e.target as HTMLInputElement
        settings.setVolume(parseFloat(target.value))
    }
    
    function handleClickOutside(e: MouseEvent) {
        if (
            open &&
            popoverElement &&
            buttonElement &&
            !popoverElement.contains(e.target as Node) &&
            !buttonElement.contains(e.target as Node)
        ) {
            open = false
        }
    }
    
    $effect(() => {
        if (open) {
            document.addEventListener('click', handleClickOutside)
            return () => document.removeEventListener('click', handleClickOutside)
        }
    })
    
    const volumePercentage = $derived(Math.round(settings.volume * 100))
</script>

<button 
    bind:this={buttonElement}
    onclick={() => open = !open} 
    class="panel-1-button"
>
    Settings
</button>

{#if open}
    <div bind:this={popoverElement} class="settings-popover">
        <div class="settings-header">Settings</div>
        <div class="settings-content">
            <label for="volume-slider">
                <span class="volume-label">Volume</span>
                <span class="volume-value">{volumePercentage}%</span>
            </label>
            <input
                id="volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.volume}
                oninput={handleVolumeChange}
                class="volume-slider"
            />
        </div>
    </div>
{/if}

<style>
    .settings-popover {
        position: absolute;
        top: 60px;
        left: 20px;
        background: #000;
        border: 2px solid var(--african-violet, #9999ff);
        border-radius: 20px;
        padding: 20px;
        min-width: 300px;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(153, 153, 255, 0.3);
    }
    
    .settings-header {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--african-violet, #9999ff);
        margin-bottom: 15px;
        text-transform: uppercase;
    }
    
    .settings-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--orange, #ff9966);
        font-size: 1.1rem;
        margin-bottom: 5px;
    }
    
    .volume-label {
        text-transform: uppercase;
    }
    
    .volume-value {
        font-weight: bold;
        color: var(--butterscotch, #ffcc99);
    }
    
    .volume-slider {
        padding: 0.65rem 0;
        width: 100%;
        height: 8px;
        border-radius: 5px;
        background: #333;
        outline: none;
        appearance: none;
        -webkit-appearance: none;
    }
    
    .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        background: var(--african-violet, #9999ff);
        cursor: pointer;
        transition: background 0.2s;
        position: relative;
        top: -0.35rem;
    }
    
    .volume-slider::-webkit-slider-thumb:hover {
        background: var(--butterscotch, #ffcc99);
    }
    
    .volume-slider::-moz-range-thumb {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        background: var(--african-violet, #9999ff);
        cursor: pointer;
        border: none;
        transition: background 0.2s;
    }
    
    .volume-slider::-moz-range-thumb:hover {
        background: var(--butterscotch, #ffcc99);
    }
    
    .volume-slider::-webkit-slider-runnable-track {
        width: 100%;
        height: 8px;
        border-radius: 5px;
        background: linear-gradient(to right, 
            var(--african-violet, #9999ff) 0%, 
            var(--african-violet, #9999ff) calc(var(--volume) * 100%), 
            #333 calc(var(--volume) * 100%), 
            #333 100%);
    }
</style>