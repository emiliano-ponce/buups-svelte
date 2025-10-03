<script lang="ts">
    import { makeCascade, type CascadeData } from '$lib/utils/cascadeHelper'
    import { onMount } from 'svelte'
    import '../app.css'
    import '../classic.css'

    let { children } = $props();

    let cascade: CascadeData = $state([])
    let topBtn: HTMLButtonElement | null = null
    let lcarsKeystroke: HTMLAudioElement | null = null

    function scrollFunction() {
        if (!topBtn) return
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            topBtn.style.display = 'block'
        } else {
            topBtn.style.display = 'none'
        }
    }

    function topFunction() {
        document.body.scrollTop = 0 // Safari
        document.documentElement.scrollTop = 0 // Chrome, Firefox, IE, Edge
    }

    function playSoundAndRedirect(audioId: string, url: string) {
        const audio = document.getElementById(audioId) as HTMLAudioElement | null
        if (!audio) return
        audio.play()
        audio.onended = () => (window.location.href = url)
    }

    function goToAnchor(anchorId: string) {
        window.location.hash = anchorId
    }

    onMount(() => {
        cascade = makeCascade(24, 9)
        // Touch‑start listener (keeps the page from “ghost‑click” on mobile)
        document.addEventListener('touchstart', () => {}, false)

        // Scroll handling
        window.onscroll = scrollFunction
        scrollFunction()

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

        lcarsKeystroke = document.getElementById('LCARSkeystroke') as HTMLAudioElement
        const playButtons = document.querySelectorAll<HTMLButtonElement>('.playSoundButton')
        playButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!lcarsKeystroke) return
                lcarsKeystroke.pause()
                lcarsKeystroke.currentTime = 0
                lcarsKeystroke.play()
            })
        })
    })
</script>

<audio id="beep1" src="beep1.mp3" preload="auto"></audio>
<audio id="beep2" src="beep2.mp3" preload="auto"></audio>
<audio id="beep3" src="beep3.mp3" preload="auto"></audio>
<audio id="beep4" src="beep4.mp3" preload="auto"></audio>

<section class="wrap-standard" id="column-3">
    <div class="wrap">
        <div class="left-frame-top">
            <!-- Example button – keep the inline handler for simplicity -->
            <button onclick={() => playSoundAndRedirect('beep2', '#')} class="panel-1-button"> SYSTEM INFORMATION </button>
            <div class="panel-2">02<span class="hop">-262000</span></div>
        </div>

        <div class="right-frame-top">
            <div class="banner">LCARS LOG ENTRY</div>

            <div class="data-cascade-button-group">
                <div class="data-cascade-wrapper" id="default">
                    {#each cascade as column}
                        <div class="data-column">
                            {#each column as cell, i}
                                <div data-cascade-row class={'dc-row-' + (i + 1)}>{cell}</div>
                            {/each}
                        </div>
                    {/each}
                </div>

                <nav>
                    <button onclick={() => playSoundAndRedirect('beep2', '#')}>01</button>
                    <button onclick={() => playSoundAndRedirect('beep2', '#')}>02</button>
                    <button onclick={() => playSoundAndRedirect('beep2', '#')}>03</button>
                    <button onclick={() => playSoundAndRedirect('beep2', '#')}>04</button>
                </nav>
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
            <!-- Scroll‑to‑top button – we bind the element to `topBtn` -->
            <button
                bind:this={topBtn}
                onclick={() => {
                    topFunction()
                    playSoundAndRedirect('beep4', '#')
                }}
                id="topBtn"
            >
                <span class="hop">screen</span> top
            </button>

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
                Content &copy; 2025 *replace this text with your website's name or URL.* <br />
                LCARS Inspired Website Template by
                <a href="https://www.thelcars.com">www.TheLCARS.com</a>.
            </footer>
        </div>
    </div>
</section>

<div class="headtrim"></div>
<div class="baseboard"></div>

<style>
</style>
