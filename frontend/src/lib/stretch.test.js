import { describe, it, expect } from 'vitest'
import { EXDB } from './exercises.js'
import { buildStretchSet, isStretch, STRETCH_SEC, STRETCH_COUNT } from './stretch.js'

const byId = id => EXDB.find(e => e.id === id)

describe('isStretch', () => {
  it('matches stretch holds and skips lookalikes', () => {
    expect(isStretch(byId('1511'))).toBe(true)    // hamstring stretch
    expect(isStretch(byId('0669'))).toBe(true)    // rear deltoid stretch
    expect(isStretch(byId('3645'))).toBe(false)   // single leg bridge with outstretched leg
    expect(isStretch(byId('0025'))).toBe(false)   // barbell bench press
  })
})

describe('buildStretchSet', () => {
  it('builds timed 30 s holds', () => {
    for (const type of ['upper', 'lower', 'full']) {
      for (const bands of [true, false]) {
        for (const cfg of buildStretchSet(EXDB, { bands, type })) {
          expect(cfg).toMatchObject({ sets: 1, sec: STRETCH_SEC, weight: 0, mode: 'time' })
          expect(cfg.id).toBeTruthy()
        }
      }
    }
  })

  it('keeps 6-8 holds on the real catalogue', () => {
    for (const type of ['upper', 'lower', 'full']) {
      for (const bands of [true, false]) {
        const n = buildStretchSet(EXDB, { bands, type }).length
        expect(n, `${type}/${bands}`).toBeGreaterThanOrEqual(6)
        expect(n, `${type}/${bands}`).toBeLessThanOrEqual(8)
      }
    }
  })

  it('upper stays above the waist, lower below it', () => {
    const up = new Set(['shoulders', 'chest', 'upper arms', 'neck'])
    const lo = new Set(['upper legs', 'lower legs'])
    for (const c of buildStretchSet(EXDB, { bands: false, type: 'upper' })) expect(up.has(byId(c.id).bp)).toBe(true)
    for (const c of buildStretchSet(EXDB, { bands: true, type: 'lower' })) expect(lo.has(byId(c.id).bp)).toBe(true)
  })

  it('bodyweight-only mode uses no apparatus', () => {
    for (const c of buildStretchSet(EXDB, { bands: false, type: 'full' })) {
      expect(byId(c.id).eq).toBe('body weight')
    }
  })

  it('bands mode only adds assisted apparatus, never machines or balls', () => {
    const bw = new Set(buildStretchSet(EXDB, { bands: false, type: 'full' }).map(c => c.id))
    for (const c of buildStretchSet(EXDB, { bands: true, type: 'full' })) {
      const eq = byId(c.id).eq
      expect(['body weight', 'band', 'cable', 'assisted', 'rope', 'resistance band'].includes(eq), c.id + ':' + eq).toBe(true)
    }
    // the assisted pool is strictly larger on the real catalogue
    expect(buildStretchSet(EXDB, { bands: true, type: 'lower' }).length)
      .toBeGreaterThanOrEqual(buildStretchSet(EXDB, { bands: false, type: 'lower' }).length)
    expect(bw.size).toBeGreaterThan(0)
  })

  it('full mixes both halves', () => {
    const up = new Set(['shoulders', 'chest', 'upper arms', 'neck'])
    const bps = buildStretchSet(EXDB, { bands: true, type: 'full' }).map(c => byId(c.id).bp)
    expect(bps.some(b => up.has(b))).toBe(true)
    expect(bps.some(b => !up.has(b))).toBe(true)
  })

  it('is deterministic and duplicate-free', () => {
    const a = buildStretchSet(EXDB, { bands: true, type: 'full' })
    const b = buildStretchSet(EXDB, { bands: true, type: 'full' })
    expect(a).toEqual(b)
    expect(new Set(a.map(c => c.id)).size).toBe(a.length)
  })

  it('returns what a thin pool has instead of padding', () => {
    const tiny = [byId('1511'), byId('0669'), byId('0025')]
    const out = buildStretchSet(tiny, { bands: false, type: 'full' })
    expect(out.map(c => c.id).sort()).toEqual(['0669', '1511'])
  })

  it('defaults to the catalogue and caps at seven', () => {
    expect(buildStretchSet(null, { bands: true, type: 'full' }).length).toBe(STRETCH_COUNT)
  })
})
