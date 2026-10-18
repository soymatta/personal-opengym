import { defineConfig, devices } from '@playwright/test'

// E2E runs against the production build (`npm run build`) served by `vite preview`, so the
// specs exercise the same bundle (and service worker) that gets deployed. `npm run e2e` builds
// first for exactly that reason: the config cannot tell a stale `dist/` from a fresh one, and a
// suite that silently tests yesterday's JSX is worse than one that fails.
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
