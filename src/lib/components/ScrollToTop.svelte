<script lang="ts">
    import { onMount } from 'svelte'

    interface Props {
        onclick?: () => void
        showText?: string
    }

    let { onclick, showText = 'screen top' }: Props = $props()

    let topBtn: HTMLButtonElement | null = $state(null)

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

    function handleClick() {
        topFunction()
        if (onclick) onclick()
    }

    onMount(() => {
        window.onscroll = scrollFunction
        scrollFunction()
    })
</script>

<button bind:this={topBtn} onclick={handleClick} id="topBtn">
    {showText}
</button>

<style>
    #topBtn {
        display: none;
        position: fixed;
        bottom: 0;
        z-index: 99;
        border-radius: 0;
        border-top: var(--panel-border);
        border-right: none;
        border-bottom: var(--panel-border);
        border-left: none;
        outline: none;
        width: var(--lfw);
        padding: var(--left-frame-padding);
        padding-bottom: 10vh;
        background-color: var(--panel-top-button-color);
        text-align: right;
        line-height: 1;
        font-weight: bold;
        text-transform: uppercase;
        color: black;
        cursor: pointer;
    }

    #topBtn:hover {
        filter: brightness(115%);
    }

    #topBtn:active {
        filter: brightness(80%);
    }

    @media (max-width: 525px) {
        #topBtn {
            padding-bottom: 6vh;
        }
    }
</style>
