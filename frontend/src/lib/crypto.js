// Zero-knowledge vault crypto — no server, no database, no dependency.
//
// The passphrase never leaves the device: PBKDF2-SHA256 stretches it into a non-extractable
// AES-256-GCM key, the state is gzipped and sealed with a fresh random IV on every write, and
// only the ciphertext is uploaded. A wrong passphrase fails the GCM tag instead of returning
// garbage, so the only offline attack is guessing the passphrase against PBKDF2's cost.
//
// Wire format (JSON, uploaded as-is):
//   { v: 1,
//     kdf: { n: 'PBKDF2-SHA256', i: <iterations>, s: <salt, base64> },
//     z: 0 | 1,                       // 1 = ciphertext is gzip(JSON), 0 = raw
//     iv: <12-byte nonce, base64>,
//     ct: <ciphertext + tag, base64> }
//
// `additionalData` binds the blob to this format: a ciphertext re-labelled as another version
// (or another app's blob) fails to open even with the right passphrase.

const VERSION = 1
const KDF = 'PBKDF2-SHA256'
export const PBKDF2_ITERATIONS = 600000
const SALT_BYTES = 16
const IV_BYTES = 12
const AAD = new TextEncoder().encode('opengym-vault-v1')

const enc = new TextEncoder()
const dec = new TextDecoder()

/** Random bytes from the platform CSPRNG (never Math.random). */
const randomBytes = n => crypto.getRandomValues(new Uint8Array(n))

/** base64 without `String.fromCharCode(...bigArray)` — that blows the stack past ~64 KB. */
export function b64(bytes) {
  let s = ''
  const CHUNK = 0x8000
  for (let i = 0; i < bytes.length; i += CHUNK) {
    s += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  }
  return btoa(s)
}

export function unb64(str) {
  const s = atob(str)
  const out = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i)
  return out
}

/** gzip when the platform has it (every current browser and Node 18+); raw otherwise. */
async function pack(bytes) {
  if (typeof CompressionStream === 'undefined') return { z: 0, bytes }
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))
  return { z: 1, bytes: new Uint8Array(await new Response(stream).arrayBuffer()) }
}

async function unpack(z, bytes) {
  if (!z) return bytes
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

/**
 * Stretch a passphrase into an AES-256-GCM key. `iterations` is a parameter so tests can use a
 * cheap value; the produced blob records the real one, so opening never has to guess.
 */
export async function deriveKey(passphrase, salt, iterations = PBKDF2_ITERATIONS) {
  const material = await crypto.subtle.importKey(
    'raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

/** Encrypt a JSON-serialisable object into the wire format above. */
export async function sealState(passphrase, state, { iterations = PBKDF2_ITERATIONS } = {}) {
  const salt = randomBytes(SALT_BYTES)
  const key = await deriveKey(passphrase, salt, iterations)
  const packed = await pack(enc.encode(JSON.stringify(state)))
  const iv = randomBytes(IV_BYTES)
  const ct = new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: AAD }, key, packed.bytes,
  ))
  return {
    v: VERSION,
    kdf: { n: KDF, i: iterations, s: b64(salt) },
    z: packed.z,
    iv: b64(iv),
    ct: b64(ct),
  }
}

/** Decrypt a wire-format blob. Throws `vault-passphrase` when the tag does not verify. */
export async function openState(passphrase, doc) {
  if (!doc || doc.v !== VERSION || !doc.kdf || doc.kdf.n !== KDF || !doc.kdf.s || !doc.iv || !doc.ct) {
    throw new Error('vault-format')
  }
  const salt = unb64(doc.kdf.s)
  const key = await deriveKey(passphrase, salt, doc.kdf.i)
  let plain
  try {
    plain = new Uint8Array(await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: unb64(doc.iv), additionalData: AAD }, key, unb64(doc.ct),
    ))
  } catch (e) {
    throw new Error('vault-passphrase')
  }
  return JSON.parse(dec.decode(await unpack(doc.z, plain)))
}
