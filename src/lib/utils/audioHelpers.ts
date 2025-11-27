import { settings } from "./settings.svelte"

export function playSound(audioId: string): HTMLAudioElement | undefined {
    const audio = document.getElementById(audioId) as HTMLAudioElement | null
    if (!audio) return
    const origVol = Number(audio.getAttribute('volume') ?? '1')
    audio.volume = settings.volume * origVol
    audio.play()
    return audio
}

export function playSoundAndRedirect(audioId: string, url: string) {
    const audio = playSound(audioId)
    if (!audio) window.location.href = url
    else {
        audio.onended = () => (window.location.href = url)
    }
}
