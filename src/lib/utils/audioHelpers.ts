export function playSound(audioId: string): HTMLAudioElement | undefined {
    const audio = document.getElementById(audioId) as HTMLAudioElement | null
    if (!audio) return
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
