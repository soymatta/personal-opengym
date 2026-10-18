import { create } from 'zustand'
import { registerCustom } from '../lib/exercises.js'
import { DEMO, DEMO_SEEDED } from '../lib/demo.js'
import {
  isSupabaseConfigured, sbPush, sbPull, sbSession, onSbAuthChange, sbSignOut as sbSignOutSupabase,
} from '../lib/supabase.js'

// Local-first store. There is no backend: the whole state is one JSON document in
// localStorage, and Supabase (when configured) is an optional cloud mirror for multi-device
// sync. No login is required to use the app; a cloud account only adds sync.

const KEY = 'gym_state_v1'
export const DEF = {
  unit: 'kg', restSec: 90, sound: true, keepAwake: true, lang: 'en',
  theme: 'dark', accent: 'lime', body: 'male', targetW: null,
  bodyweight: [], routines: [], week: {}, dayPlan: {},
  exWeights: {}, workouts: [], active: null, customEx: [], gifSize: 'full',
  // effort: which per-set effort scale is logged — 'none' | 'rir' | 'rpe'. null, not 'none', so
  // that a profile which never chose (loaded state is overlaid on DEF, on every path) still
  // falls back to the `showRir` boolean this replaced and keeps the column it had. See effortOf.
  reminder: { on: false, time: '08:00', tz: null }, effort: null,
  // injuries: the joints to warn about, from the fixed set in lib/injuries.js. An empty list is
  // the default and means the app says nothing — the warning is opt-in, never assumed.
  injuries: []
}
const clone = o => JSON.parse(JSON.stringify(o))

function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return Object.assign(clone(DEF), JSON.parse(raw))
  } catch (e) { /* ignore */ }
  return clone(DEF)
}

const hasData = st => !!((st.workouts || []).length || (st.routines || []).length || (st.bodyweight || []).length)

export const useStore = create((set, get) => {
  let pushTm = null

  const persist = (S, push = true) => {
    S._ts = Date.now()
    registerCustom(S.customEx)
    localStorage.setItem(KEY, JSON.stringify(S))
    set({ S })
    // Cloud mirror (no-op unless VITE_SUPABASE_* is set and a session exists).
    if (push && isSupabaseConfigured()) {
      clearTimeout(pushTm)
      pushTm = setTimeout(() => get().pushState(), 1500)
    }
  }

  // A setting changed right before switching away/closing the tab must not get lost mid-debounce.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'hidden') return
    if (pushTm) { clearTimeout(pushTm); pushTm = null; get().pushState() }
  })

  const wipeLocal = () => {
    set({ sbUser: null })
    localStorage.removeItem('gym_guest')
    localStorage.removeItem('gym_dirty')
    localStorage.removeItem(KEY)
    persist(clone(DEF), false)
  }

  return {
    S: (() => { const s = loadState(); registerCustom(s.customEx); return s })(),
    // Supabase cloud account. Only set when the optional cloud sync is configured and the user
    // signed in; null when the app is running purely locally (the default).
    sbUser: null,
    ready: false,

    // Mutate a draft of S via producer fn, then persist + schedule a cloud push.
    update(mut, push = true) {
      const S = clone(get().S)
      mut(S)
      persist(S, push)
    },
    replaceState(S, push = false) { persist(clone(S), push) },

    // Every install is usable without an account — this is always true now. Kept so the
    // tab bar / shell keep a single "am I in?" check.
    isGuest: () => true,
    setGuest() {},
    setSbUser(u) { set({ sbUser: u }) },

    // Cloud sign-out: push first so the other devices keep the latest, then drop the session.
    // Local data stays on this device.
    async sbSignOut() {
      try { await get().pushState() } catch (e) { /* */ }
      try { await sbSignOutSupabase() } catch (e) { /* */ }
      set({ sbUser: null })
    },
    async signOut() { set({ sbUser: null }) },
    wipeLocal,

    async pushState() {
      if (!isSupabaseConfigured()) return
      try { await sbPush(get().S) } catch (e) { /* offline / not signed in — keep local */ }
    },
    async pullState() {
      if (!isSupabaseConfigured()) return
      try {
        const remote = await sbPull(get().S?._ts || 0)
        if (remote) {
          const active = get().S.active
          const next = Object.assign(clone(DEF), remote)
          if (active) next.active = active
          persist(next, false)
        }
      } catch (e) { /* offline — keep local */ }
    },

    // Demo build only: drop the seeded example profile back in (Settings → "Reset demo data").
    async resetDemo() {
      const { buildDemoState } = await import('../lib/demoSeed.js')
      localStorage.removeItem('gym_dirty')
      persist(Object.assign(clone(DEF), buildDemoState()), false)
    },

    // Boot: restore the optional Supabase session, then go straight in. No login gate.
    async boot() {
      // Demo build (GitHub Pages / static demo): seed once, stay local.
      if (DEMO) {
        if (!localStorage.getItem(DEMO_SEEDED)) {
          localStorage.setItem(DEMO_SEEDED, '1')
          await get().resetDemo()
        }
        set({ ready: true })
        return
      }
      // Supabase cloud session (optional): restores login across refreshes and pulls the
      // newest state. The listener keeps sbUser in sync when the session expires or another
      // tab signs out.
      if (isSupabaseConfigured()) {
        try {
          const sess = await sbSession()
          if (sess?.user) {
            set({ sbUser: sess.user })
            await get().pullState()
          }
          onSbAuthChange(async (sbU) => {
            set({ sbUser: sbU })
            if (sbU) { try { await get().pullState() } catch (e) { /* */ } }
          })
        } catch (e) { /* cloud unavailable — local still works */ }
      }
      set({ ready: true })
    }
  }
})

export { hasData }
