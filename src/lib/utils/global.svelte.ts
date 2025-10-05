const appState = $state({
    isMobile: false,
})

export function updateIsMobile() {
    const mobileBreak = getComputedStyle(document.documentElement).getPropertyValue('--mobile-breakpoint').trim()
    appState.isMobile = window.innerWidth <= parseInt(mobileBreak.replace('px', ''));
}

export function getIsMobile() {
    return appState.isMobile;
}