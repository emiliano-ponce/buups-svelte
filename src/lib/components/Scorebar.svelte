<script lang="ts">
    let { score = 0, editable = false, onChange = () => {}, name = 'score' } = $props()

    let isDragging = $state(false)
    let barRef: HTMLDivElement | null = $state(null)
    let inputValue = $state(score)

    const scorePercentage = $derived((score / 10) * 100)

    // ---------- Audio stuff ----------
    // let audio: HTMLAudioElement | null = $state(null)

    // let shouldEndLoop = false
    // let inLoop = false

    // const INTRO_END = 1
    // const LOOP_START = 1.95
    // const LOOP_END = 2.95
    // const OUTRO_START = 3
    // const AUDIO_END = 4

    // $effect(() => {
    //     const audioElement = document.getElementById('powerAndHold') as HTMLAudioElement
    //     if (!audioElement) return

    //     audio = audioElement

    //     const handleTimeUpdate = () => {
    //         if (!audio) return
    //         const t = audio.currentTime

    //         // Intro phase: jump to loop when intro ends
    //         if (!inLoop && t >= INTRO_END) {
    //             inLoop = true
    //             audio.currentTime = LOOP_START
    //             return
    //         }

    //         if (inLoop && t >= LOOP_END) {
    //             if (shouldEndLoop) {
    //                 // Exit loop and play outro
    //                 inLoop = false
    //                 shouldEndLoop = false
    //                 audio.currentTime = OUTRO_START
    //             } else {
    //                 // Continue looping
    //                 audio.currentTime = LOOP_START
    //             }
    //             return
    //         }

    //         if (t >= AUDIO_END) {
    //             audio.pause()
    //             audio.currentTime = 0
    //             inLoop = false
    //             shouldEndLoop = false
    //         }
    //     }

    //     audio.addEventListener('timeupdate', handleTimeUpdate)

    //     return () => {
    //         audio?.removeEventListener('timeupdate', handleTimeUpdate)
    //     }
    // })

    // function beginAudio() {
    //     if (!audio) return
    //     audio.currentTime = 0
    //     inLoop = false
    //     shouldEndLoop = false
    //     audio.play()
    // }

    // function endAudio() {
    //     shouldEndLoop = true
    // }
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
        // beginAudio()
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
        // endAudio()
    }

    function handleTouchStart(e) {
        if (!editable) return
        isDragging = true
        // beginAudio()
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

    @media (max-width: 768px) {
    }
</style>
