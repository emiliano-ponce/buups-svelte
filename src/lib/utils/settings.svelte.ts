import { browser } from '$app/environment'

function loadVolume(): number {
    if (!browser) return 1
    const stored = localStorage.getItem('volume')
    return stored ? Number(stored) : 1
}

class SettingsStore {
    volume = $state(loadVolume())

    setVolume(newVolume: number) {
        this.volume = newVolume
        if (browser) {
            localStorage.setItem('volume', newVolume.toString())
        }
    }
}

export const settings = new SettingsStore()
