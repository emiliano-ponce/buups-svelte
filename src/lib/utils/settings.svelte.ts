import { browser } from '$app/environment'

interface Settings {
    volume: number
    bgmEnabled: boolean
    scorebarSliderEnabled: boolean
    buttonBeepsEnabled: boolean
    reviewUpdatesEnabled: boolean
    enterprise: boolean
}

export const SOUND_SETTINGS = {
    bgm: 'bgmEnabled',
    scorebar: 'scorebarSliderEnabled',
    buttons: 'buttonBeepsEnabled',
    reviewUpdates: 'reviewUpdatesEnabled',
    enterprise: 'enterprise',
} as const

export type SoundSettingKey = keyof typeof SOUND_SETTINGS

const DEFAULTS: Settings = {
    volume: 1,
    bgmEnabled: true,
    scorebarSliderEnabled: true,
    buttonBeepsEnabled: true,
    reviewUpdatesEnabled: true,
    enterprise: true,
}

function loadSettings(): Settings {
    if (!browser) return DEFAULTS

    try {
        const stored = localStorage.getItem('settings')
        if (!stored) return DEFAULTS

        return { ...DEFAULTS, ...JSON.parse(stored) }
    } catch {
        return DEFAULTS
    }
}

class SettingsStore implements Settings {
    volume = $state(loadSettings().volume)
    bgmEnabled = $state(loadSettings().bgmEnabled)
    scorebarSliderEnabled = $state(loadSettings().scorebarSliderEnabled)
    buttonBeepsEnabled = $state(loadSettings().buttonBeepsEnabled)
    reviewUpdatesEnabled = $state(loadSettings().reviewUpdatesEnabled)
    enterprise = $state(loadSettings().enterprise)

    private save() {
        if (!browser) return

        const settings: Settings = {
            volume: this.volume,
            bgmEnabled: this.bgmEnabled,
            scorebarSliderEnabled: this.scorebarSliderEnabled,
            buttonBeepsEnabled: this.buttonBeepsEnabled,
            reviewUpdatesEnabled: this.reviewUpdatesEnabled,
            enterprise: this.enterprise,
        }

        localStorage.setItem('settings', JSON.stringify(settings))
    }

    setSetting<K extends keyof this>(setting: K, value: this[K]) {
        this[setting] = value
        this.save()
    }

    setVolume(newVolume: number) {
        this.volume = newVolume
        this.save()
    }

    toggleBooleanSetting(setting: keyof Omit<Settings, 'volume'>) {
        this[setting] = !this[setting]
        this.save()
    }
}

export const settings = new SettingsStore()
