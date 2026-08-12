<script lang="ts">
    import { browser } from '$app/environment'
    import { playSound } from '$lib/utils/audioHelpers'
    import { onDestroy, onMount } from 'svelte'
    
    interface Star {
        x: number
        y: number
        size: number
        opacity: number
        duration: number
        delay: number
    }

    let { onComplete, startBlastOff } = $props()
    let isBlastingOff = $state(false)
    let shouldUnmount = $state(false)
    let stars: Array<Star> = $state([])

    onMount(() => {
        document.body.style.overflow = 'hidden'
        generateStars()
    })

    function generateStars() {
        const starCount = Math.floor((window.innerWidth * window.innerHeight) / 5000)
        const duration = Math.random() * 100 + 50
        stars = Array.from({ length: starCount }, () => ({
            x: Math.random() * 100, // percentage
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.5,
            duration,
            delay: -Math.random() * duration
        }))
    }

    onDestroy(() => {
        if (browser) {
            document.body.style.overflow = ''
        }
    })

    $effect(() => {
        if (startBlastOff && !isBlastingOff) {
            isBlastingOff = true
            playSound('warpOut', 'enterprise')
            setTimeout(() => {
                shouldUnmount = true
                onComplete()
            }, 2000)
        }
    })
</script>

<audio src="/sounds/tng_warp_out1.mp3" id="warpOut"></audio>
{#if !shouldUnmount}
    <div class="loading-overlay">
        <div class="page-container">
            {#each stars as star, index (index)}
                <div
                    class="star"
                    style="
                        left: {star.x}%;
                        top: {star.y}%;
                        width: {star.size}px;
                        height: {star.size}px;
                        opacity: {star.opacity};
                        animation-duration: {star.duration}s;
                        animation-delay: {star.delay}s;
                    "
                ></div>
            {/each}

            <div class="ent-full" class:blasting-off={isBlastingOff}>
                <div class="front-light"></div>
                <div class="enterprise">
                    <div class="main">
                        <div class="center-circle"></div>

                        <div class="connector-vert"></div>
                        <div class="connector-horz-1"></div>
                        <div class="connector-horz-2"></div>
                        <div class="engine-1">
                            <div class="bottom"></div>
                        </div>
                        <div class="engine-2"></div>
                        <div class="bottom"></div>
                    </div>

                    <div class="engage">
                        <div class="engage-2"></div>
                        <div class="engage-3"></div>
                        <div class="engage-4"></div>
                        <div class="engage-5"></div>
                        <div class="small-engage se-1"></div>
                        <div class="se-2"></div>
                        <div class="se-3"></div>
                        <div class="se-4"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .star {
        position: absolute;
        background: white;
        border-radius: 50%;
        animation: fall linear infinite;
    }
    
    @keyframes fall {
        from { transform: translateY(-100vh); }
        to { transform: translateY(100vh); }
    }

    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
        opacity: 0.95;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .page-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .ent-full {
        animation: enterpriseHover 2s ease-in-out infinite;
        position: absolute;
        left: 50%;
        bottom: 20%;
        will-change: transform;
        opacity: 1;
    }

    .engage, .front-light {
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
    }

    .ent-full.blasting-off {
        animation: enterpriseBlastOff 2000ms ease-in forwards;
        .front-light {
            opacity: 1;
        }
        .engage {
            opacity: 1;
        }
    }

    @keyframes enterpriseHover {
        0%, 100% {
            transform: translate(-50%, 0);
        }
        25% {
            transform: translate(-48%, 5px);
        }
        50% {
            transform: translate(-50%, 0px);
        }
        75% {
            transform: translate(-52%, -5px);
        }
    }

    @keyframes enterpriseBlastOff {
        0% {
            transform: translate(-50%, 0);
        }
        100% {
            transform: translate(-50%, -150vh);
        }
    }

    .front-light {
        width: 250px;
        height: 250px;
        background: transparent;
        padding-top: 1px;
        padding-right: 50px;
        margin: 10px auto 0;
        position: relative;
        -moz-border-radius: 80px / 50px;
        -webkit-border-radius: 100px / 50px;
        border-radius: 150px / 150px;
        box-shadow: 5px -5px 1px rgb(219, 167, 69);
        z-index: 30;
    }

    .main {
        width: 200px;
        height: 200px;
        background: grey;
        margin: -225px auto 0;
        position: relative;
        -moz-border-radius: 80px / 50px;
        -webkit-border-radius: 100px / 50px;
        border-radius: 100px / 100px;
        box-shadow:
            5px 5px 0px #545454,
            5px 5px 0px rgb(219, 167, 69);
        z-index: 2;
    }

    .center-circle {
        position: relative;
        width: 75px;
        height: 75px;
        top: 62.5px;
        background: #939393;
        margin: auto;
        -moz-border-radius: 80px / 50px;
        -webkit-border-radius: 100px / 50px;
        border-radius: 100px / 100px;
    }

    .center-circle:after {
        position: absolute;
        width: 50px;
        height: 50px;
        left: 12.5px;
        top: 29px;
        background: #939393;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        border-radius: 5px;
        content: '';
    }

    .connector-vert {
        width: 20px;
        height: 160px;
        top: 30px;
        margin: auto;
        position: relative;
        background: grey;
        -moz-border-radius: 100px / 50px;
        -webkit-border-radius: 100px / 50px;
        border-radius: 100px;
    }

    .connector-horz-1 {
        z-index: 1;
        width: 40px;
        height: 20px;
        top: -10px;
        margin-left: 62px;
        position: relative;
        background: grey;
        -ms-transform: rotate(-40deg);
        -webkit-transform: rotate(-40deg);
        transform: rotate(-40deg);
    }

    .connector-horz-2 {
        width: 40px;
        height: 20px;
        top: -30px;
        margin-left: 97px;
        position: relative;
        background: grey;
        -ms-transform: rotate(40deg);
        -webkit-transform: rotate(40deg);
        transform: rotate(40deg);
    }

    .engine-1 {
        width: 35px;
        height: 125px;
        top: -70px;
        margin-left: 45px;
        position: relative;
        background: grey;
        -moz-border-radius: 100px / 50px;
        -webkit-border-radius: 100px / 50px;
        border-radius: 100px;
        box-shadow: 3px 5px 0px #545454;
    }

    .engine-2 {
        width: 35px;
        height: 125px;
        top: -195px;
        margin-left: 120px;
        position: relative;
        background: grey;
        -moz-border-radius: 100px / 50px;
        -webkit-border-radius: 100px / 50px;
        border-radius: 100px;
        box-shadow: 5px 5px 0px #545454;
    }

    .engine-2:after {
        position: absolute;
        width: 27px;
        height: 27px;
        left: 4px;
        top: 99px;
        background: grey;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        border-radius: 5px;
        content: '';
        box-shadow: 8px 1px 0px #545454;
    }

    .engine-1:after {
        position: absolute;
        width: 27px;
        height: 27px;
        left: 4px;
        top: 99px;
        background: grey;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        border-radius: 5px;
        content: '';
        box-shadow: 6px 2px 0px #545454;
    }

    .bottom {
        position: relative;
        height: 40px;
        width: 40px;
        overflow: hidden;
    }

    .engage,
    .engage-2,
    .engage-3,
    .engage-4,
    .engage-5 {
        position: relative;
        width: 5px;
        height: 75px;
        top: 100px;
        margin: auto;
        background: rgb(219, 167, 69);
        -moz-border-radius: 80px / 50px;
        -webkit-border-radius: 100px / 50px;
        border-radius: 100px / 100px;
    }

    .small-engage,
    .se-2,
    .se-3,
    .se-4 {
        position: relative;
        width: 5px;
        height: 50px;
        left: 20px;
        top: -250px;
        background: rgb(219, 167, 69);
        -moz-border-radius: 80px / 50px;
        -webkit-border-radius: 100px / 50px;
        border-radius: 100px / 100px;
    }

    .engage-2 {
        top: 55px;
        right: 40px;
    }

    .engage-3 {
        top: -20px;
        left: 40px;
    }

    .engage-4 {
        top: -160px;
        left: 80px;
    }

    .engage-5 {
        top: -235px;
        right: 80px;
    }

    .se-2 {
        top: -300px;
        left: 60px;
    }

    .se-3 {
        top: -350px;
        left: -20px;
    }

    .se-4 {
        top: -400px;
        left: -60px;
    }
</style>
