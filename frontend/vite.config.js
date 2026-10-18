import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Media (exercise images/GIFs) is served by a local static server in dev; there is no API.
const media = process.env.MEDIA_TARGET || 'http://127.0.0.1:8888'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      '/img': { target: media, changeOrigin: true },
      '/gif': { target: media, changeOrigin: true }
    }
  },
  build: { chunkSizeWarningLimit: 1500 },
  // Unit tests only — the Playwright specs in e2e/ are run by `npm run e2e`, not Vitest.
  test: { include: ['src/**/*.test.{js,jsx}'] }
})
