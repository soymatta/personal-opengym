import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>
)

// PWA: register the runtime-caching service worker (https only — localhost is exempted by
// browsers, and preview builds over http simply skip it).
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {})
}
