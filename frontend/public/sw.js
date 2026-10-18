/* openGym service worker — runtime caching (works with Vite's hashed asset names).
   Media (img/gif) cache-first; the app shell network-first with an offline fallback. */
const CACHE = 'opengym-rt-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()))
})

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)
  if (e.request.method !== 'GET' || url.origin !== location.origin) return

  const isMedia = url.pathname.includes('/img/') || url.pathname.includes('/gif/')
  if (isMedia) {
    e.respondWith(caches.open(CACHE).then(c => c.match(e.request).then(hit =>
      hit || fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res })
    )))
  } else {
    e.respondWith(fetch(e.request).then(res => {
      // Clone before handing the response to the page: a clone() inside the floating
      // caches.open() below runs after the page has consumed the body, and throws
      // "Response body is already used". Cloning here is synchronously safe.
      if (res.ok) {
        const copy = res.clone()
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {})
      }
      return res
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match('index.html'))))
  }
})
