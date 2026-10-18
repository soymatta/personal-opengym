import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Optional: only used when VITE_IMG_BASE=img/ (serving your own copy of the dataset media).
// By default the app loads images/GIFs from the CDN, so there is no media server to run.
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
