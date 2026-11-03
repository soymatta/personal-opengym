/* openGym service worker — runtime caching (works with Vite's hashed asset names).
   Media (img/gif, ours or the dataset CDN) cache-first and kept between visits; the app shell
   network-first with an offline fallback. */
const CACHE = 'opengym-rt-v1'
const MEDIA_CACHE = 'opengym-media-v1'
const KEEP = [CACHE, MEDIA_CACHE]
// The dataset's media is on jsdelivr by default (see lib/exercises.js); a build that serves its
// own copy sets VITE_IMG_BASE and gets same-origin requests instead.
const MEDIA_HOSTS = ['cdn.jsdelivr.net']
const MEDIA_PATH = /(\/images\/|\/videos\/|\/img\/|\/gif\/)/
// A thumbnail is ~15 KB and an animation ~90 KB, but the library holds 1,324 of each: cap the
// cache so one browsing session cannot fill the device, oldest entry out first.
const MEDIA_MAX = 400

const isMedia = url => MEDIA_PATH.test(url.pathname) &&
  (url.origin === location.origin || MEDIA_HOSTS.includes(url.hostname))

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => !KEEP.includes(k)).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()))
})

async function trim(cache) {
  const keys = await cache.keys()
  if (keys.length <= MEDIA_MAX) return
  await Promise.all(keys.slice(0, keys.length - MEDIA_MAX).map(k => cache.delete(k)))
}

async function mediaFirst(req) {
  const cache = await caches.open(MEDIA_CACHE)
  const hit = await cache.match(req)
  if (hit) return hit
  const res = await fetch(req)
  // An <img> load is no-cors, so a cross-origin hit arrives opaque with ok === false. It is
  // cacheable all the same, which is the whole point of caching the CDN's copy.
  if (res.ok || res.type === 'opaque') {
    cache.put(req, res.clone()).then(() => trim(cache)).catch(() => {})
  }
  return res
}

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)
  if (e.request.method !== 'GET') return

  if (isMedia(url)) {
    // Cache-first, so a picture you have already seen never waits on the network again.
    e.respondWith(mediaFirst(e.request).catch(() => caches.match(e.request)))
    return
  }
  if (url.origin !== location.origin) return

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
})
