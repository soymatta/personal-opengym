import { create } from 'zustand'
import { registerCustom } from '../lib/exercises.js'
import { DEMO, DEMO_SEEDED } from '../lib/demo.js'
import {
  isSupabaseConfigured, sbPush, sbPull, sbSession, onSbAuthChange, sbSignOut as sbSignOutSupabase,
} from '../lib/supabase.js'
import {
  isVaultConfigured, vaultStatus, vaultRestore, vaultConnect as vaultConnectVault,
  vaultUnlock as vaultUnlockVault, vaultLock as vaultLockVault,
  vaultPush as vaultPushVault, vaultPull as vaultPullVault,
} from '../lib/vault.js'
import { createAutoSync } from '../lib/autosync.js'

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
  injuries: [],
  // notes: free text per exercise id ("seat at 3", "left shoulder pinches"). Written to be read
  // in the workout, so it is shown on the exercise block, not buried in a detail screen. An
  // exercise with no note has no key at all — the map stays as small as the notes in it.
  notes: {},
  // measures: tape measurements, one entry per day, every site in centimetres (see lib/measures.js
  // for why the unit is not the profile's). Sits beside `bodyweight` — same idea, more sites.
  measures: [],
  // onboarding survey (lib/onboard.js + surveySheet in sheets.jsx): what the user answered when
  // asked how they train, so the app can recommend a plan. Flat scalars merge cleanly on load,
  // so no loadState change is needed. surveyDone also covers "Skip" — asked once either way.
  age: null, goal: null, experience: null, trainDays: null, equipment: 'full', surveyDone: false
}
const clone = o => JSON.parse(JSON.stringify(o))

// Zero-manual sync: one poller per session. pullState is a no-op when nothing is configured
// or the vault is locked, so starting it unconditionally (except demo) is safe and covers a
// vault connected later in the same session. Guarded against double boot (StrictMode).
let autoSync = null
function ensureAutoSync(pullState) {
  if (!autoSync) autoSync = createAutoSync({ pull: () => pullState() })
  autoSync.start()
}

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
    // Cloud mirrors (both no-ops unless configured): the optional Supabase account and the
    // encrypted vault. Local storage is always written first — sync never blocks the UI.
    if (push && (isSupabaseConfigured() || isVaultConfigured())) {
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
    // Encrypted vault (lib/vault.js): `vaultOn` = a token+gist is stored on this device,
    // `vaultUser` = the GitHub login once unlocked. Neither is part of the training document.
    vaultOn: isVaultConfigured(),
    vaultUser: null,
    vaultRemembered: false,
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

    // Apply a pulled document without echoing it back to the cloud (persist(..., false)).
    // The in-progress workout belongs to this device and is never overwritten by a pull.
    applyRemote(remote) {
      const active = get().S.active
      const next = Object.assign(clone(DEF), remote)
      if (active) next.active = active
      persist(next, false)
    },
    applyRemoteIfNewer(remote) {
      if (remote && (remote._ts || 0) > (get().S?._ts || 0)) { get().applyRemote(remote); return true }
      return false
    },

    // Encrypted vault: first connection (token + passphrase) or a returning device.
    async vaultConnect(token, passphrase, remember) {
      const res = await vaultConnectVault({ token, passphrase, remember, state: get().S })
      set({ vaultOn: true, vaultUser: res.login, vaultRemembered: !!remember })
      if (!get().applyRemoteIfNewer(res.state)) await get().pushState()
      return res
    },
    async vaultUnlock(passphrase) {
      const res = await vaultUnlockVault(passphrase)
      set({ vaultOn: true, vaultUser: res.login })
      if (!get().applyRemoteIfNewer(res.state)) await get().pushState()
      return res
    },
    // Stop syncing here. Local data stays; the token (and remembered passphrase) go away.
    vaultLock() {
      const st = vaultLockVault({ forget: true })
      set({ vaultOn: st.configured, vaultUser: null, vaultRemembered: false })
    },

    async pushState() {
      if (isSupabaseConfigured()) {
        try { await sbPush(get().S) } catch (e) { /* offline / not signed in — keep local */ }
      }
      if (isVaultConfigured()) {
        try { await vaultPushVault(get().S) } catch (e) { /* offline / locked — keep local */ }
      }
    },
    async pullState() {
      if (isSupabaseConfigured()) {
        try {
          const remote = await sbPull(get().S?._ts || 0)
          if (remote) get().applyRemote(remote)
        } catch (e) { /* offline — keep local */ }
      }
      try {
        const remote = await vaultPullVault(get().S?._ts || 0)
        if (remote) get().applyRemote(remote)
      } catch (e) { /* offline / locked — keep local */ }
    },

    // Demo build only: drop the seeded example profile back in (Settings → "Reset demo data").
    async resetDemo() {
      const { buildDemoState } = await import('../lib/demoSeed.js')
      localStorage.removeItem('gym_dirty')
      persist(Object.assign(clone(DEF), buildDemoState()), false)
    },

    // Boot: restore the optional cloud sessions, then go straight in. No login gate.
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
      // Encrypted vault (optional, no server): a remembered device rebuilds its session and
      // pulls the newest document. A device that only stored the token stays locked until the
      // passphrase is entered in Settings.
      try {
        const vst = vaultRestore()
        set({ vaultOn: vst.configured, vaultUser: vst.unlocked ? vst.login : null, vaultRemembered: vst.remembered })
        if (vst.unlocked) await get().pullState()
      } catch (e) { /* vault unavailable — local still works */ }
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
      // Zero-manual: pull every 30 s and on focus/online/visible, push is already debounced.
      ensureAutoSync(() => get().pullState())
      set({ ready: true })
    }
  }
})

export { hasData }
