// Zero-manual auto-sync — poll + pull on focus, never push.
// Push is already automatic (debounced in useStore.persist); this helper only decides WHEN to
// pull, so every device converges without a "Sync now" tap. Pulls are last-write-wins by `_ts`
// and never overwrite an in-progress workout (useStore.applyRemote keeps `active`).

export const AUTO_PULL_MS = 30000

// pull: () => Promise — the store's pullState. Returns { start, stop } so boot runs it once
// and tests can drive it with fake timers. Concurrent pulls collapse into one; failures never
// throw (offline / locked is a normal state, not an error).
export function createAutoSync({ pull, intervalMs = AUTO_PULL_MS } = {}) {
  if (typeof pull !== 'function') throw new Error('pull is required')
  let timer = null
  let pulling = false
  let started = false

  const tryPull = async () => {
    if (pulling) return
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
    pulling = true
    try { await pull() } catch (e) { /* offline / locked — keep local */ }
    pulling = false
  }

  const onVisible = () => { tryPull() }
  const onFocus = () => { tryPull() }
  const onOnline = () => { tryPull() }

  const start = () => {
    if (started) return { stop }
    started = true
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVisible)
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', onFocus)
      window.addEventListener('online', onOnline)
    }
    if (typeof setInterval !== 'undefined' && intervalMs > 0) {
      timer = setInterval(tryPull, intervalMs)
    }
    return { stop }
  }

  const stop = () => {
    started = false
    if (timer) { clearInterval(timer); timer = null }
    if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVisible)
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('online', onOnline)
    }
  }

  return { start, stop, tryPull }
}
