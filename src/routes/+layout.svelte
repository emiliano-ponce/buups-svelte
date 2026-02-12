<script lang="ts">
    import Button from '$lib/components/Button.svelte'
    import DataCascade from '$lib/components/DataCascade.svelte'
    import LogoutButton from '$lib/components/LogoutButton.svelte'
    import Navigation from '$lib/components/Navigation.svelte'
    import ScrollToTop from '$lib/components/ScrollToTop.svelte'
    import SettingsPopover from '$lib/components/SettingsPopover.svelte'
    import { playSoundAndRedirect } from '$lib/utils/audioHelpers'
    import { makeCascade, type CascadeData } from '$lib/utils/cascadeHelper'
    import { updateIsMobile } from '$lib/utils/global.svelte'
    import { settings } from '$lib/utils/settings.svelte'
    import { onMount } from 'svelte'
    import '../app.css'
    import '../classic.css'
    import type { LayoutProps } from './$types'

    let { children, data }: LayoutProps = $props()

    let cascade: CascadeData = $state([])
    let settingsOpen = $state(false)

    function handleResize() {
        updateIsMobile()
    }

    onMount(() => {
        cascade = makeCascade(24, 9)
        // Touch‑start listener (keeps the page from "ghost‑click" on mobile)
        document.addEventListener('touchstart', () => {}, false)

        const accordions = document.querySelectorAll<HTMLElement>('.accordion')
        accordions.forEach(acc => {
            acc.addEventListener('click', function () {
                this.classList.toggle('active')
                const content = this.nextElementSibling as HTMLElement
                if (content.style.maxHeight) {
                    content.style.maxHeight = ''
                } else {
                    content.style.maxHeight = `${content.scrollHeight}px`
                }
            })
        })

        updateIsMobile()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    })
    let playBgm = $state(settings.bgmEnabled)
    $effect(() => {
        const bgmAudio = document.getElementById('bgm') as HTMLAudioElement | null
        if (!bgmAudio) return
        
        if (settings.bgmEnabled) {
            bgmAudio.play().catch(() => {
                // Browser may block autoplay, ignore the error
            })
        } else {
            bgmAudio.pause()
        }
    })
</script>

<audio id="beep1" src="/sounds/beep1.mp3" preload="auto"></audio>
<audio id="beep2" src="/sounds/beep2.mp3" preload="auto"></audio>
<audio id="beep3" src="/sounds/beep3.mp3" preload="auto"></audio>
<audio id="beep4" src="/sounds/beep4.mp3" preload="auto"></audio>
<audio id="bgm" src="/sounds/tos_bridge_9.mp3" preload="auto" loop volume={0.65} autoplay={playBgm}></audio>
<audio id="power-on" src="/sounds/power_on.mp3" preload="auto"></audio>
<audio id="power-hold" src="/sounds/power_hold.mp3" preload="auto"></audio>
<audio id="power-off" src="/sounds/power_off.mp3" preload="auto"></audio>
<audio id="incomming-transmission" src="/sounds/incomingtransmission_clean.mp3" preload="auto"></audio>

<div style="flex: 1 1 1100px;">
    <div class="wrap">
        <div class="left-frame-top">
            <SettingsPopover bind:open={settingsOpen} />
            <div class="panel-2">02<span class="hop">-262000</span></div>
        </div>

        <div class="right-frame-top">
            <div class="banner">LCARS LOG ENTRY</div>

            <div class="data-cascade-button-group">
                <DataCascade data={cascade} />

                <Navigation>
                    <Button --button-color="var(--african-violet)" onclick={() => playSoundAndRedirect('beep2', '/', 'buttons')}>
                        Home
                    </Button>
                    <Button --button-color="var(--orange)" onclick={() => playSoundAndRedirect('beep2', '/account', 'buttons')}>
                        Account
                    </Button>
                    <Button --button-color="var(--bluey)" onclick={() => playSoundAndRedirect('beep2', '/review', 'buttons')}>
                        Review
                    </Button>
                    {#if data.user}
                        <LogoutButton />
                    {:else}
                        <Button --button-color="var(--green)" onclick={() => playSoundAndRedirect('beep2', '/login', 'buttons')}>
                            Log in
                        </Button>
                    {/if}
                </Navigation>
            </div>

            <div class="bar-panel first-bar-panel">
                <div class="bar-1"></div>
                <div class="bar-2"></div>
                <div class="bar-3"></div>
                <div class="bar-4"></div>
                <div class="bar-5"></div>
            </div>
        </div>
    </div>

    <div class="wrap" id="gap">
        <div class="left-frame">
            <ScrollToTop onclick={() => playSoundAndRedirect('beep4', '#', 'buttons')} />

            <div>
                <div class="panel-3">03<span class="hop">-111968</span></div>
                <div class="panel-4">04<span class="hop">-041969</span></div>
                <div class="panel-5">05<span class="hop">-1701D</span></div>
                <div class="panel-6">06<span class="hop">-071984</span></div>
                <div class="panel-7">07<span class="hop">-081940</span></div>
                <div class="panel-8">08<span class="hop">-47148</span></div>
                <div class="panel-9">09<span class="hop">-081966</span></div>
            </div>

            <div>
                <div class="panel-10">10<span class="hop">-31</span></div>
            </div>
        </div>

        <div class="right-frame">
            <div class="bar-panel">
                <div class="bar-6"></div>
                <div class="bar-7"></div>
                <div class="bar-8"></div>
                <div class="bar-9"></div>
                <div class="bar-10"></div>
            </div>

            <main>
                {@render children()}
            </main>

            <footer>
                LCARS Inspired Website Template by
                <a href="https://www.thelcars.com">www.TheLCARS.com</a>. Modified with love. ♥
            </footer>
        </div>
    </div>
</div>

<div class="headtrim"></div>
<div class="baseboard"></div>

<style>
</style>
