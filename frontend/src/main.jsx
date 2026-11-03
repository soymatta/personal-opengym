import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>
)

// PWA: register the runtime-caching service worker. HTTPS anywhere, and localhost even over
// http — a browser treats it as a secure context, so the dev server gets the same media cache
// as the deployed app instead of re-downloading every animation on each visit.
const dev = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
if ('serviceWorker' in navigator && (location.protocol === 'https:' || dev)) {
  navigator.serviceWorker.register('sw.js').catch(() => {})
}
