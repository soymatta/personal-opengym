import { describe, it, expect, beforeAll, beforeEach } from 'vitest'

// public/sw.js is loaded with a fake `self` and a fake Cache Storage, because the two things
// worth pinning there are policy, not plumbing: which requests the worker touches at all, and
// that the copy it caches is taken *before* the page gets the body (the bug that left the
// cache empty: "Response body is already used"). The file itself lives in public/, so this test
// sits in src/ — everything under public/ is copied verbatim into the build.

let listeners, store, fetched

// the real Cache API resolves a relative key against the worker's own URL, so "index.html"
// and "http://localhost:5173/index.html" are the same entry — the mock has to agree
const key = r => new URL(typeof r === 'string' ? r : r.url, 'http://localhost:5173').href

const cacheOf = name => {
  if (!store.has(name)) store.set(name, new Map())
  const entries = store.get(name)
  return {
    match: async r => entries.get(key(r)),
    put: async (r, res) => { entries.set(key(r), res) },
    keys: async () => [...entries.keys()].map(u => new Request(u)),
    delete: async r => entries.delete(key(r)),
    _entries: entries,
  }
}

beforeAll(async () => {
  listeners = {}
  store = new Map()
  fetched = []
  globalThis.location = { origin: 'http://localhost:5173' }
  globalThis.caches = {
    // the real caches.open() resolves with the cache, so the mock has to be async too
    open: async name => cacheOf(name),
    keys: async () => [...store.keys()],
    delete: async name => store.delete(name),
    match: async r => {
      for (const entries of store.values()) if (entries.has(key(r))) return entries.get(key(r))
      return undefined
    },
  }
  globalThis.fetch = async req => {
    fetched.push(key(req))
    return new Response('body:' + key(req), { status: 200 })
  }
  globalThis.realFetch = globalThis.fetch
  globalThis.self = {
    addEventListener: (type, fn) => { listeners[type] = fn },
    skipWaiting: () => { globalThis.self._skipped = true },
    clients: { claim: () => { globalThis.self._claimed = true } },
  }
  await import('../public/sw.js')
})

beforeEach(() => {
  store = new Map()
  fetched = []
  globalThis.fetch = globalThis.realFetch     // a test that swaps fetch cannot leak into the next
  delete globalThis.self._skipped
  delete globalThis.self._claimed
})

const fire = async (type, request) => {
  const e = { request, waited: [], responded: [] }
  e.waitUntil = p => e.waited.push(p)
  e.respondWith = p => e.responded.push(p)
  listeners[type](e)
  await Promise.all(e.waited)
  return e
}
const url = p => new Request(p)

describe('the service worker takes over the right requests', () => {
  it('skips waiting and claims its clients', async () => {
    await fire('install')
    await fire('activate')
    expect(globalThis.self._skipped).toBe(true)
    expect(globalThis.self._claimed).toBe(true)
  })

  it('drops old caches and keeps its own two', async () => {
    store.set('opengym-rt-v0', new Map([['a', 'b']]))
    store.set('opengym-media-v1', new Map())
    await fire('activate')
    expect([...store.keys()].sort()).toEqual(['opengym-media-v1', 'opengym-rt-v1'].filter(k => store.has(k)).sort())
    expect(store.has('opengym-rt-v0')).toBe(false)
  })

  it('handles its own media, ours or the dataset CDN, and nothing else', async () => {
    const media = [await fire('fetch', url('http://localhost:5173/img/a.jpg')), await fire('fetch', url('https://cdn.jsdelivr.net/gh/x@1/images/a.jpg')), await fire('fetch', url('https://cdn.jsdelivr.net/gh/x@1/videos/a.gif'))]
    expect(media.every(e => e.responded.length === 1)).toBe(true)

    // a request it has nothing to say about is left to the browser, and a POST is never cached
    const ajena = await fire('fetch', url('https://example.com/analytics.js'))
    expect(ajena.responded).toEqual([])
    expect(fetched).not.toContain('https://example.com/analytics.js')
    const post = await fire('fetch', { url: 'http://localhost:5173/img/a.jpg', method: 'POST' })
    expect(post.responded).toEqual([])
  })

  it('does not mistake an image for a page just because the name says so', async () => {
    const e = await fire('fetch', url('https://cdn.jsdelivr.net/gh/x@1/npm/chart.js/dist/chart.js'))
    expect(e.responded).toEqual([])
  })
})

describe('media is cached the first time and never fetched twice', () => {
  it('goes to the media cache, not the shell cache', async () => {
    const e = await fire('fetch', url('https://cdn.jsdelivr.net/gh/x@1/videos/a.gif'))
    await (await e.responded[0])
    expect(fetched).toEqual(['https://cdn.jsdelivr.net/gh/x@1/videos/a.gif'])
    await new Promise(r => setTimeout(r, 0))     // el put va en flotante
    expect([...store.get('opengym-media-v1').keys()]).toEqual(['https://cdn.jsdelivr.net/gh/x@1/videos/a.gif'])
    expect(store.has('opengym-rt-v1')).toBe(false)
  })

  it('answers the second request from the cache', async () => {
    const first = await fire('fetch', url('http://localhost:5173/img/a.jpg'))
    await first.responded[0]
    const second = await fire('fetch', url('http://localhost:5173/img/a.jpg'))
    expect(await (await second.responded[0]).text()).toBe('body:http://localhost:5173/img/a.jpg')
    expect(fetched).toHaveLength(1)
  })

  it('keeps an opaque CDN response, which is what an <img> load actually returns', async () => {
    globalThis.fetch = async () => new Response(null, { type: 'opaque' })
    const e = await fire('fetch', url('https://cdn.jsdelivr.net/gh/x@1/images/a.jpg'))
    await e.responded[0]
    await new Promise(r => setTimeout(r, 0))
    expect(store.get('opengym-media-v1').size).toBe(1)
  })

  it('never grows past its cap, oldest out first', async () => {
    const entries = new Map()
    for (let i = 0; i < 401; i++) entries.set(`https://cdn.jsdelivr.net/gh/x@1/images/${i}.jpg`, 'x')
    store.set('opengym-media-v1', entries)
    const e = await fire('fetch', url('https://cdn.jsdelivr.net/gh/x@1/images/extra.jpg'))
    await e.responded[0]
    await new Promise(r => setTimeout(r, 0))
    const kept = [...store.get('opengym-media-v1').keys()]
    expect(kept.length).toBe(400)
    expect(kept).not.toContain('https://cdn.jsdelivr.net/gh/x@1/images/0.jpg')
    expect(kept).toContain('https://cdn.jsdelivr.net/gh/x@1/images/extra.jpg')
  })
})

describe('the app shell', () => {
  it('hands the page a response it can still read after caching a copy', async () => {
    const req = url('http://localhost:5173/assets/index-abc.js')
    const e = await fire('fetch', req)
    const res = await e.responded[0]
    // the bug: cloning inside the floating caches.open() threw once the page had the body
    expect(res.bodyUsed).toBe(false)
    expect(await res.text()).toBe('body:http://localhost:5173/assets/index-abc.js')
    await new Promise(r => setTimeout(r, 0))
    const cached = store.get('opengym-rt-v1').get(req.url)
    expect(cached).toBeTruthy()
    expect(cached.bodyUsed).toBe(false)
    expect(await cached.text()).toBe('body:http://localhost:5173/assets/index-abc.js')
  })

  it('falls back to the cached page when the network is gone', async () => {
    globalThis.fetch = async () => { throw new Error('offline') }
    store.set('opengym-rt-v1', new Map([['http://localhost:5173/index.html', new Response('shell')]]))
    const e = await fire('fetch', url('http://localhost:5173/some/route'))
    expect(await (await e.responded[0]).text()).toBe('shell')
  })
})
