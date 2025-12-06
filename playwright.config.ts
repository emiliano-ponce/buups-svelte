import { defineConfig } from '@playwright/test'

export default defineConfig({
    webServer: {
        command: process.env.CI ? 'npm run preview' : 'npm run build && npm run preview',
        port: 4173,
        env: { DATABASE_URL: './test.db' },
    },
    testDir: 'e2e',
	globalSetup: './e2e/global-setup.ts',
	globalTeardown: './e2e/global-teardown.ts',
})
