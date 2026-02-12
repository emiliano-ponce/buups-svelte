// audioHelpers.ts
import { settings, SOUND_SETTINGS, type SoundSettingKey } from './settings.svelte'

export function playSound(audioId: string, settingToCheck: SoundSettingKey): HTMLAudioElement | undefined {
    const settingKey = SOUND_SETTINGS[settingToCheck]
    const isEnabled = settings[settingKey]

    if (!isEnabled) return

    const audio = document.getElementById(audioId) as HTMLAudioElement | null
    if (!audio) return

    const origVol = Number(audio.getAttribute('volume') ?? '1')
    audio.volume = settings.volume * origVol
    audio.play()
    return audio
}

export function playSoundAndRedirect(audioId: string, url: string, settingToCheck: SoundSettingKey) {
    const audio = playSound(audioId, settingToCheck)
    if (!audio) window.location.href = url
    else {
        audio.onended = () => (window.location.href = url)
    }
}
