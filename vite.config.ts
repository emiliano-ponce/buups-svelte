import { sveltekit } from '@sveltejs/kit/vite'
import tailwind from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [tailwind(), sveltekit()],
    test: { include: ['src/**/*.{test,spec}.{js,ts}'] },
})
