import { sveltekit } from '@sveltejs/kit/vite'
import tailwind from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [tailwind(), sveltekit()],
    // Don't reload the dev server when local SQLite files (local.db, dev.db, -wal/-shm) change.
    server: { watch: { ignored: ['**/*.db', '**/*.db-*'] } },
    test: { include: ['src/**/*.{test,spec}.{js,ts}'] },
})
