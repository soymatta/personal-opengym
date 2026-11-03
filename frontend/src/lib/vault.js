// Encrypted vault sync — the "login" without a server or a database.
//
// The whole training state is sealed by lib/crypto.js and stored as ONE file in a private
// GitHub Gist. GitHub is a dumb blob store here: it only ever receives ciphertext, so a leak
// of the gist (or of GitHub itself) exposes no training data. There is no user table, no auth
// server and no per-device database — the passphrase IS the account, and the token only says
// where the blob lives.
//
// Auth is a GitHub token with the `gist` scope. It is kept in localStorage because the app has
// to push without asking again; the passphrase is kept in memory only, unless the user opts
// into "remember on this device" (which is no worse than the plaintext state localStorage
// already holds on that device). "Lock & forget" removes both.
//
// Conflict rule: whole-document last-write-wins by `_ts`, exactly like the optional Supabase
// mirror. One person on several devices is the target; simultaneous offline edits on two
// devices keep the newest write, not a merge.

import { sealState, openState } from './crypto.js'

const API = 'https://api.github.com'
const DESC = 'openGym encrypted vault'
const FILE = 'opengym.vault.json'
const LS_KEY = 'gym_vault_v1'

// Memory-only session: { token, passphrase, gistId, login }. Cleared on reload unless the
// passphrase was remembered, in which case vaultRestore() rebuilds it.
let session = null
let pushChain = Promise.resolve()
let memCfg = null

function readCfg() {
  if (typeof localStorage === 'undefined') return memCfg
  try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null') } catch (e) { return null }
}

function writeCfg(cfg) {
  memCfg = cfg
  if (typeof localStorage === 'undefined') return
  if (cfg) localStorage.setItem(LS_KEY, JSON.stringify(cfg))
  else localStorage.removeItem(LS_KEY)
}

/** GitHub API call with the token. Maps the statuses the UI can actually act on to codes. */
async function gh(token, path, { method = 'GET', body } = {}) {
  let res
  try {
    res = await fetch(API + path, {
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: 'Bearer ' + token,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (e) {
    throw new Error('vault-network')
  }
  if (res.status === 401) throw new Error('vault-token')
  if (res.status === 404) throw new Error('vault-missing')
  if (res.status === 403 || res.status === 429) throw new Error('vault-rate')
  if (!res.ok) throw new Error('vault-network')
  return res.json()
}

/** The vault is a gist we created; find it by description across the first few pages. */
async function findGist(token) {
  for (let page = 1; page <= 3; page++) {
    const list = await gh(token, `/gists?per_page=100&page=${page}`)
    const hit = (list || []).find(g => g.description === DESC)
    if (hit) return hit
    if (!Array.isArray(list) || list.length < 100) break
  }
  return null
}

async function readGist(token, gistId) {
  const gist = await gh(token, `/gists/${gistId}`)
  const file = gist?.files?.[FILE]
  if (!file) throw new Error('vault-format')
  let text = file.content
  // A gist file over ~1 MB comes back truncated with a raw_url instead of its content.
  if (file.truncated && file.raw_url) {
    let res
    try { res = await fetch(file.raw_url) } catch (e) { throw new Error('vault-network') }
    if (!res.ok) throw new Error('vault-network')
    text = await res.text()
  }
  try { return JSON.parse(text) } catch (e) { throw new Error('vault-format') }
}

async function writeGist(token, gistId, doc) {
  await gh(token, `/gists/${gistId}`, {
    method: 'PATCH',
    body: { files: { [FILE]: { content: JSON.stringify(doc) } } },
  })
}

/** What the UI needs to draw the card. Never exposes the passphrase. */
export function vaultStatus() {
  const cfg = readCfg()
  return {
    configured: !!(cfg?.token && cfg?.gistId),
    unlocked: !!session,
    login: session?.login || cfg?.login || null,
    remembered: !!cfg?.passphrase,
  }
}

export const isVaultConfigured = () => {
  const cfg = readCfg()
  return !!(cfg?.token && cfg?.gistId)
}

/** Rebuild the session after a reload when the user chose to remember this device. */
export function vaultRestore() {
  const cfg = readCfg()
  if (cfg?.token && cfg?.gistId && cfg?.passphrase) {
    session = { token: cfg.token, passphrase: cfg.passphrase, gistId: cfg.gistId, login: cfg.login }
  }
  return vaultStatus()
}

/**
 * First connection: validate the token, find the vault (or create it from the local state),
 * and prove the passphrase by opening it. Returns the remote state when one existed.
 */
export async function vaultConnect({ token, passphrase, remember = false, state }) {
  const cleanToken = String(token || '').trim()
  if (!cleanToken || !passphrase) throw new Error('vault-config')
  const user = await gh(cleanToken, '/user')
  const login = user?.login || null
  const existing = await findGist(cleanToken)

  let remote = null
  let gistId
  if (existing) {
    gistId = existing.id
    remote = await openState(passphrase, await readGist(cleanToken, gistId))
  } else {
    const doc = await sealState(passphrase, stripActive(state))
    const gist = await gh(cleanToken, '/gists', {
      method: 'POST',
      body: {
        description: DESC,
        public: false,
        files: { [FILE]: { content: JSON.stringify(doc) } },
      },
    })
    gistId = gist.id
  }

  writeCfg({ token: cleanToken, gistId, login, ...(remember ? { passphrase } : {}) })
  session = { token: cleanToken, passphrase, gistId, login }
  return { login, state: remote, created: !existing }
}

/** Returning device: the token is stored, the passphrase is asked for once. */
export async function vaultUnlock(passphrase) {
  const cfg = readCfg()
  if (!cfg?.token || !cfg?.gistId) throw new Error('vault-config')
  const remote = await openState(passphrase, await readGist(cfg.token, cfg.gistId))
  session = { token: cfg.token, passphrase, gistId: cfg.gistId, login: cfg.login }
  return { login: cfg.login, state: remote }
}

/** Stop syncing here. `forget` also drops the token, so the next unlock asks for everything. */
export function vaultLock({ forget = true } = {}) {
  session = null
  if (forget) writeCfg(null)
  return vaultStatus()
}

const stripActive = state => {
  const clean = { ...state }
  delete clean.active
  return clean
}

/** Encrypt the current state and overwrite the gist. No-op (false) when locked. */
export function vaultPush(state) {
  const s = session
  if (!s) return Promise.resolve(false)
  const run = pushChain.then(async () => {
    await writeGist(s.token, s.gistId, await sealState(s.passphrase, stripActive(state)))
    return true
  })
  // Keep the chain usable after a failure without hiding that failure from the caller.
  pushChain = run.catch(() => {})
  return run
}

/** Pull the remote state when it is newer than `localTs`; null otherwise. */
export async function vaultPull(localTs = 0) {
  const s = session
  if (!s) return null
  const remote = await openState(s.passphrase, await readGist(s.token, s.gistId))
  return (remote?._ts || 0) > localTs ? remote : null
}

/** Source string for the UI to translate — the lib never imports i18n. */
export function vaultErrorKey(e) {
  switch (e?.message) {
    case 'vault-token': return 'Token is invalid or expired'
    case 'vault-passphrase': return 'Wrong passphrase — or the cloud copy is damaged'
    case 'vault-format': return 'The cloud copy has an unsupported format'
    case 'vault-rate': return 'GitHub rate limit hit — try again in a minute'
    case 'vault-missing': return 'The cloud copy was deleted on GitHub'
    case 'vault-config': return 'Enter a GitHub token and a passphrase'
    default: return 'Sync failed'
  }
}
