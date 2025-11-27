<script lang="ts">
    import { settings } from '$lib/utils/settings.svelte'
    import { onMount } from 'svelte'

    let { score = 0, editable = false, onChange = () => {}, name = 'score' } = $props()

    let isDragging = $state(false)
    let barRef: HTMLDivElement | null = $state(null)
    let inputValue = $state(score)

    const scorePercentage = $derived((score / 10) * 100)

    // ---------- Audio stuff ----------
    let audioCtx: AudioContext | null = $state(null)
    let gainNode: GainNode | null = $state(null)
    let powerHoldSource: AudioBufferSourceNode | null = $state(null)
    let powerOnBuffer: AudioBuffer | null = $state(null)
    let powerHoldBuffer: AudioBuffer | null = $state(null)
    let powerOffBuffer: AudioBuffer | null = $state(null)
    let isPlaying = $state(false)

    onMount(async () => {
        audioCtx = new AudioContext()
        gainNode = audioCtx.createGain()
        gainNode.connect(audioCtx.destination)
        try {
            // Load all three audio files
            const [onRes, holdRes, offRes] = await Promise.all([
                fetch('/sounds/power_on.mp3'),
                fetch('/sounds/power_hold.mp3'),
                fetch('/sounds/power_off.mp3'),
            ])

            const [onArrayBuffer, holdArrayBuffer, offArrayBuffer] = await Promise.all([
                onRes.arrayBuffer(),
                holdRes.arrayBuffer(),
                offRes.arrayBuffer(),
            ])

            const [ponb, phb, poffb] = await Promise.all([
                audioCtx.decodeAudioData(onArrayBuffer),
                audioCtx.decodeAudioData(holdArrayBuffer),
                audioCtx.decodeAudioData(offArrayBuffer),
            ])
            powerOnBuffer = ponb
            powerHoldBuffer = phb
            powerOffBuffer = poffb
        } catch (err) {
            console.error('Failed to load audio:', err)
        }
    })
    
    function beginAudio() {
        if (!audioCtx || !powerOnBuffer || !powerHoldBuffer || isPlaying || !gainNode) return
        isPlaying = true
        
        const powerOnSource = audioCtx.createBufferSource()
        powerOnSource.buffer = powerOnBuffer
        gainNode.gain.value = settings.volume
        powerOnSource.connect(gainNode)
        
        powerHoldSource = audioCtx!.createBufferSource()
        powerHoldSource!.loop = true
        powerOnSource.onended = () => {
            powerHoldSource!.buffer = powerHoldBuffer
            gainNode!.gain.value = settings.volume
            powerHoldSource!.connect(gainNode!)
            powerHoldSource!.start()
        }

        powerOnSource.start()
    }

    function endAudio() {
        if (!audioCtx || !powerHoldSource || !powerOffBuffer) return

        powerHoldSource.loop = false
        powerHoldSource.onended = () => {
            const powerOffSource = audioCtx!.createBufferSource()
            powerOffSource.buffer = powerOffBuffer
            gainNode!.gain.value = settings.volume
            powerOffSource.connect(gainNode!)
            powerOffSource.start()
            powerOffSource.onended = () => {
                isPlaying = false
            }
        }
    }
    // ---------- END Audio stuff ----------

    function getScoreFromPosition(clientX) {
        if (!barRef) return score

        const rect = barRef.getBoundingClientRect()
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
        const percentage = x / rect.width
        return Math.round(percentage * 10)
    }

    function handleMouseDown(e) {
        if (!editable) return
        isDragging = true
        beginAudio()
        const newScore = getScoreFromPosition(e.clientX)
        onChange(newScore)
    }

    function handleMouseMove(e) {
        if (!isDragging) return
        const newScore = getScoreFromPosition(e.clientX)
        onChange(newScore)
    }

    function handleMouseUp() {
        isDragging = false
        endAudio()
    }

    function handleTouchStart(e) {
        if (!editable) return
        isDragging = true
        beginAudio()
        const touch = e.touches[0]
        const newScore = getScoreFromPosition(touch.clientX)
        onChange(newScore)
    }

    function handleTouchMove(e) {
        if (!isDragging) return
        const touch = e.touches[0]
        const newScore = getScoreFromPosition(touch.clientX)
        onChange(newScore)
    }

    function handleInputChange() {
        const value = Number(inputValue)
        inputValue = value
        onChange(value)
    }

    $effect(() => {
        inputValue = score
    })

    $effect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            window.addEventListener('touchmove', handleTouchMove)
            window.addEventListener('touchend', handleMouseUp)

            return () => {
                window.removeEventListener('mousemove', handleMouseMove)
                window.removeEventListener('mouseup', handleMouseUp)
                window.removeEventListener('touchmove', handleTouchMove)
                window.removeEventListener('touchend', handleMouseUp)
            }
        }
    })
</script>

<div class="score-container">
    <div
        class="score-bar"
        class:draggable={editable}
        bind:this={barRef}
        onmousedown={handleMouseDown}
        ontouchstart={handleTouchStart}
        role={editable ? 'slider' : undefined}
        aria-valuemin={editable ? 0 : undefined}
        aria-valuemax={editable ? 10 : undefined}
        aria-valuenow={editable ? score : undefined}
    >
        <div class="score-overlay" style="width: {100 - scorePercentage}%"></div>
    </div>

    {#if editable}
        <input type="number" class="score-input" min="0" bind:value={inputValue} oninput={handleInputChange} {name} />
    {:else}
        <span class="score-text">{score}</span>
    {/if}
</div>

<style>
    .score-container {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
    }

    .score-bar {
        width: 100%;
        width: 300px;
        flex-shrink: 1;
        height: 1.5rem;
        background-image:
            repeating-linear-gradient(
                to right,
                transparent 0px,
                transparent 3px,
                var(--space-white) 3px,
                var(--space-white) 4px
            ),
            linear-gradient(to right, #e51f1f 0%, #f2a134 30%, #f7e379 50%, #bbdb44 70%, #44ce1b 100%);
        border: 1px solid var(--space-white);
        border-radius: 2px;
        overflow: hidden;
        position: relative;
    }

    .score-bar.draggable {
        cursor: pointer;
        user-select: none;
    }

    .score-bar.draggable:hover {
        border-color: #ff00ff;
    }

    .score-overlay {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        background-color: var(--space-white);
        pointer-events: none;
    }

    .score-input {
        width: 100px;
    }

    .score-text {
        font-weight: 700;
        color: var(--magenta);
        font-size: 1.25rem;
    }
</style>
