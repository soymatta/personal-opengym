import { describe, it, expect } from 'vitest'
import { sealState, openState, deriveKey, b64, unb64, PBKDF2_ITERATIONS } from './crypto.js'

// Cheap KDF cost: the point here is the protocol, not the wall-clock. The real default is
// PBKDF2_ITERATIONS and every blob records the value it was sealed with.
const FAST = { iterations: 1000 }
const PASS = 'correct horse battery staple'
const STATE = {
  _ts: 1700000000000,
  unit: 'kg',
  routines: [{ id: 'r1', name: 'Push — día 1', ex: [{ id: 'e1', sets: 3 }] }],
  notes: { e1: 'asiento en 3 — el hombro izquierdo pincha' },
  bodyweight: [{ d: '2026-01-01', kg: 81.4 }],
}

describe('vault crypto', () => {
  it('round-trips a state document without losing unicode or nesting', async () => {
    const doc = await sealState(PASS, STATE, FAST)
    expect(doc.v).toBe(1)
    expect(doc.kdf.n).toBe('PBKDF2-SHA256')
    expect(doc.kdf.i).toBe(1000)
    expect(await openState(PASS, doc)).toEqual(STATE)
  })

  it('never puts the passphrase or the plaintext on the wire', async () => {
    const doc = await sealState(PASS, STATE, FAST)
    const wire = JSON.stringify(doc)
    expect(wire).not.toContain(PASS)
    expect(wire).not.toContain('Push')
    expect(wire).not.toContain('81.4')
  })

  it('rejects a wrong passphrase instead of returning garbage', async () => {
    const doc = await sealState(PASS, STATE, FAST)
    await expect(openState('wrong passphrase', doc)).rejects.toThrow('vault-passphrase')
  })

  it('rejects a tampered ciphertext (GCM tag)', async () => {
    const doc = await sealState(PASS, STATE, FAST)
    const bytes = unb64(doc.ct)
    bytes[0] ^= 0xff
    await expect(openState(PASS, { ...doc, ct: b64(bytes) })).rejects.toThrow('vault-passphrase')
  })

  it('rejects a blob re-labelled from another format (AAD binding)', async () => {
    const doc = await sealState(PASS, STATE, FAST)
    await expect(openState(PASS, { ...doc, v: 2 })).rejects.toThrow('vault-format')
  })

  it('uses a fresh salt and IV on every seal', async () => {
    const a = await sealState(PASS, STATE, FAST)
    const b = await sealState(PASS, STATE, FAST)
    expect(a.kdf.s).not.toBe(b.kdf.s)
    expect(a.iv).not.toBe(b.iv)
    expect(a.ct).not.toBe(b.ct)
  })

  it('records the default KDF cost in the blob', async () => {
    expect(PBKDF2_ITERATIONS).toBeGreaterThanOrEqual(600000)
    const doc = await sealState(PASS, { ok: true })
    expect(doc.kdf.i).toBe(PBKDF2_ITERATIONS)
    expect(await openState(PASS, doc)).toEqual({ ok: true })
  })

  it('base64 helpers survive payloads past the fromCharCode stack limit', () => {
    // 60 KB: past the 32 KB fromCharCode chunk, under Node's 64 KB per-call CSPRNG limit.
    const big = crypto.getRandomValues(new Uint8Array(60000))
    expect(unb64(b64(big))).toEqual(big)
  })

  it('deriveKey is deterministic for the same salt and iterations', async () => {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const a = await deriveKey(PASS, salt, 1000)
    const b = await deriveKey(PASS, salt, 1000)
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, a, new Uint8Array([1, 2, 3])))
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, b, ct)
    expect([...new Uint8Array(pt)]).toEqual([1, 2, 3])
  })
})
