import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { sealState } from './crypto.js'
import {
  vaultConnect, vaultUnlock, vaultLock, vaultPush, vaultPull,
  vaultStatus, vaultRestore, vaultErrorKey,
} from './vault.js'

const PASS = 'a-long-enough-passphrase'
const STATE = { _ts: 1000, unit: 'kg', routines: [], workouts: [] }

// Minimal in-memory GitHub: /user, /gists (list/create), /gists/:id (read/update).
function fakeGitHub() {
  const gists = new Map()
  let next = 1
  const fetch = async (url, init = {}) => {
    const u = new URL(url)
    const method = init.method || 'GET'
    if (init.headers?.Authorization !== 'Bearer good-token') return resp(401, { message: 'Bad credentials' })
    if (u.pathname === '/user') return resp(200, { login: 'octocat' })
    if (u.pathname === '/gists' && method === 'GET') return resp(200, [...gists.values()])
    if (u.pathname === '/gists' && method === 'POST') {
      const body = JSON.parse(init.body)
      const id = 'g' + next++
      const g = { id, description: body.description, files: body.files }
      gists.set(id, g)
      return resp(201, g)
    }
    const m = u.pathname.match(/^\/gists\/([^/]+)$/)
    if (m) {
      const g = gists.get(m[1])
      if (!g) return resp(404, { message: 'Not Found' })
      if (method === 'PATCH') {
        const body = JSON.parse(init.body)
        g.files = { ...g.files, ...body.files }
      }
      return resp(200, g)
    }
    return resp(404, { message: 'Not Found' })
  }
  return { fetch, gists }
}

const resp = (status, data) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
  text: async () => (typeof data === 'string' ? data : JSON.stringify(data)),
})

let store
let gh

beforeEach(() => {
  const map = new Map()
  globalThis.localStorage = {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
  }
  store = map
  gh = fakeGitHub()
  globalThis.fetch = gh.fetch
  vaultLock({ forget: true })
})

afterEach(() => {
  vaultLock({ forget: true })
  delete globalThis.fetch
  delete globalThis.localStorage
})

describe('encrypted vault (GitHub Gist adapter)', () => {
  it('starts unconfigured and locked', () => {
    expect(vaultStatus()).toMatchObject({ configured: false, unlocked: false, login: null })
  })

  it('creates the vault on first connect and uploads only ciphertext', async () => {
    const res = await vaultConnect({ token: 'good-token', passphrase: PASS, state: STATE })
    expect(res.created).toBe(true)
    expect(res.login).toBe('octocat')
    expect(vaultStatus()).toMatchObject({ configured: true, unlocked: true, login: 'octocat' })

    const gist = [...gh.gists.values()][0]
    const wire = gist.files['opengym.vault.json'].content
    expect(wire).not.toContain(PASS)
    expect(wire).not.toContain('routines')
    expect(JSON.parse(wire).kdf.n).toBe('PBKDF2-SHA256')
  })

  it('opens an existing vault and returns the newer remote state', async () => {
    const doc = await sealState(PASS, { ...STATE, _ts: 5000 }, { iterations: 1000 })
    gh.gists.set('g1', {
      id: 'g1',
      description: 'openGym encrypted vault',
      files: { 'opengym.vault.json': { content: JSON.stringify(doc) } },
    })
    const res = await vaultConnect({ token: 'good-token', passphrase: PASS, state: { ...STATE, _ts: 1 } })
    expect(res.created).toBe(false)
    expect(res.state._ts).toBe(5000)
  })

  it('refuses the wrong passphrase on an existing vault', async () => {
    const doc = await sealState(PASS, STATE, { iterations: 1000 })
    gh.gists.set('g1', {
      id: 'g1',
      description: 'openGym encrypted vault',
      files: { 'opengym.vault.json': { content: JSON.stringify(doc) } },
    })
    await expect(vaultConnect({ token: 'good-token', passphrase: 'nope', state: STATE }))
      .rejects.toThrow('vault-passphrase')
  })

  it('rejects an invalid token', async () => {
    await expect(vaultConnect({ token: 'bad-token', passphrase: PASS, state: STATE }))
      .rejects.toThrow('vault-token')
  })

  it('pushes the current state and pulls it back from another device', async () => {
    await vaultConnect({ token: 'good-token', passphrase: PASS, remember: true, state: STATE })
    await vaultPush({ ...STATE, _ts: 2000, unit: 'lb' })
    // Simulate a reload with the remembered passphrase, then pull from the gist.
    vaultLock({ forget: false })
    expect(vaultStatus().unlocked).toBe(false)
    vaultRestore()
    expect(vaultStatus().unlocked).toBe(true)
    const remote = await vaultPull(1000)
    expect(remote).toMatchObject({ _ts: 2000, unit: 'lb' })
  })

  it('does not pull when the local copy is already newer', async () => {
    await vaultConnect({ token: 'good-token', passphrase: PASS, state: STATE })
    await vaultPush({ ...STATE, _ts: 1000 })
    expect(await vaultPull(2000)).toBeNull()
  })

  it('unlocks a remembered device without asking for the token again', async () => {
    await vaultConnect({ token: 'good-token', passphrase: PASS, remember: true, state: STATE })
    vaultLock({ forget: false })
    expect(vaultStatus()).toMatchObject({ configured: true, unlocked: false })
    const res = await vaultUnlock(PASS)
    expect(res.login).toBe('octocat')
    expect(vaultStatus().unlocked).toBe(true)
  })

  it('lock & forget removes the token from this device', async () => {
    await vaultConnect({ token: 'good-token', passphrase: PASS, remember: true, state: STATE })
    vaultLock({ forget: true })
    expect(store.size).toBe(0)
    expect(vaultStatus().configured).toBe(false)
  })

  it('maps failure codes to translatable source strings', () => {
    expect(vaultErrorKey(new Error('vault-token'))).toBe('Token is invalid or expired')
    expect(vaultErrorKey(new Error('vault-passphrase'))).toBe('Wrong passphrase — or the cloud copy is damaged')
    expect(vaultErrorKey(new Error('whatever'))).toBe('Sync failed')
  })
})
