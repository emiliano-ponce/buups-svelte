<!-- SettingsPopover.svelte -->
<script lang="ts">
    import Popover from '$lib/components/Popover.svelte'
    import { settings } from '$lib/utils/settings.svelte'

    let { open = $bindable(false) } = $props()

    function handleVolumeChange(e: Event) {
        const target = e.target as HTMLInputElement
        settings.setVolume(parseFloat(target.value))
    }

    const volumePercentage = $derived(Math.round(settings.volume * 100))
</script>

<Popover bind:open title="Settings" align="start" class="full-width" panelTop="60px" minWidth="300px">
    {#snippet trigger(toggle)}
        <button onclick={toggle} class="panel-1-button" aria-expanded={open} aria-haspopup="dialog">Settings</button>
    {/snippet}
    <div class="settings-content">
            <!-- Volume Slider -->
            <div class="setting-group">
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
                    style="--volume: {settings.volume}"
                />
            </div>

            <div class="setting-group">
                <label class="toggle-label">
                    <span>BGM</span>
                    <button
                        class="toggle-button"
                        class:active={settings.bgmEnabled}
                        onclick={() => settings.toggleBooleanSetting('bgmEnabled')}
                        aria-label="Toggle background music"
                    >
                        <span class="toggle-slider"></span>
                    </button>
                </label>
            </div>

            <div class="setting-group">
                <label class="toggle-label">
                    <span>Scorebar Slider</span>
                    <button
                        class="toggle-button"
                        class:active={settings.scorebarSliderEnabled}
                        onclick={() => settings.toggleBooleanSetting('scorebarSliderEnabled')}
                        aria-label="Toggle scorebar slider sound"
                    >
                        <span class="toggle-slider"></span>
                    </button>
                </label>
            </div>

            <div class="setting-group">
                <label class="toggle-label">
                    <span>Button Beeps</span>
                    <button
                        class="toggle-button"
                        class:active={settings.buttonBeepsEnabled}
                        onclick={() => settings.toggleBooleanSetting('buttonBeepsEnabled')}
                        aria-label="Toggle button beeps"
                    >
                        <span class="toggle-slider"></span>
                    </button>
                </label>
            </div>

            <div class="setting-group">
                <label class="toggle-label">
                    <span>Review Updates</span>
                    <button
                        class="toggle-button"
                        class:active={settings.reviewUpdatesEnabled}
                        onclick={() => settings.toggleBooleanSetting('reviewUpdatesEnabled')}
                        aria-label="Toggle review update sounds"
                    >
                        <span class="toggle-slider"></span>
                    </button>
                </label>
            </div>

            <div class="setting-group">
                <label class="toggle-label">
                    <span>Enterprise Blast Off</span>
                    <button
                        class="toggle-button"
                        class:active={settings.enterprise}
                        onclick={() => settings.toggleBooleanSetting('enterprise')}
                        aria-label="Toggle enterprise blass off sound"
                    >
                        <span class="toggle-slider"></span>
                    </button>
                </label>
            </div>

    </div>
</Popover>

<style>
    .settings-content {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .setting-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--orange, #ff9966);
        font-size: 1.1rem;
    }

    .toggle-label {
        cursor: pointer;
        user-select: none;
    }

    .volume-label {
        text-transform: uppercase;
    }

    .volume-value {
        font-weight: bold;
        color: var(--butterscotch, #ffcc99);
    }

    /* Toggle Switch */
    .toggle-button {
        position: relative;
        width: 50px;
        height: 26px;
        background: #333;
        border: 2px solid #555;
        border-radius: 13px;
        cursor: pointer;
        transition: all 0.3s;
        padding: 0;
    }

    .toggle-button:hover {
        border-color: var(--african-violet, #9999ff);
    }

    .toggle-button.active {
        background: var(--african-violet, #9999ff);
        border-color: var(--african-violet, #9999ff);
    }

    .toggle-slider {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 18px;
        height: 18px;
        background: #fff;
        border-radius: 50%;
        transition: transform 0.3s;
    }

    .toggle-button.active .toggle-slider {
        transform: translateX(24px);
        background: var(--butterscotch, #ffcc99);
    }

    /* Volume Slider */
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
        top: -0.45rem;
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
        background: linear-gradient(
            to right,
            var(--african-violet, #9999ff) 0%,
            var(--african-violet, #9999ff) calc(var(--volume) * 100%),
            #333 calc(var(--volume) * 100%),
            #333 100%
        );
    }
</style>
