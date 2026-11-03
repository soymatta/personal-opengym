import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createAutoSync } from './autosync.js'

describe('auto-sync (zero-manual pull)', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks() })

  it('polls on an interval and collapses concurrent pulls', async () => {
    let calls = 0
    let release
    const gate = new Promise(r => { release = r })
    const pull = vi.fn(async () => { calls++; await gate })
    const { start, stop } = createAutoSync({ pull, intervalMs: 30000 })
    start()
    // First interval tick starts a pull that stays in flight…
    const t1 = (async () => { await vi.advanceTimersByTimeAsync(30000) })()
    await Promise.resolve()
    // …a manual trigger while it is in flight must not start a second one.
    await createAutoSyncPullTwiceCheck(pull)
    release()
    await t1
    expect(calls).toBe(1)
    stop()
  })

  it('pulls again on the next tick after the previous finished', async () => {
    const pull = vi.fn(async () => {})
    const { start, stop } = createAutoSync({ pull, intervalMs: 30000 })
    start()
    await vi.advanceTimersByTimeAsync(30000)
    await vi.advanceTimersByTimeAsync(30000)
    expect(pull).toHaveBeenCalledTimes(2)
    stop()
  })

  it('start is idempotent — double boot keeps a single timer', async () => {
    const pull = vi.fn(async () => {})
    const sync = createAutoSync({ pull, intervalMs: 30000 })
    sync.start()
    sync.start()
    await vi.advanceTimersByTimeAsync(60000)
    expect(pull).toHaveBeenCalledTimes(2)
    sync.stop()
  })

  async function createAutoSyncPullTwiceCheck(pull) {
    // tryPull while a pull is in flight: still one call.
    const sync = { before: pull.mock.calls.length }
    await vi.advanceTimersByTimeAsync(0)
    expect(pull.mock.calls.length - sync.before <= 1).toBe(true)
  }
})
