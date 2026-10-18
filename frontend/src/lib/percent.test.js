import { describe, it, expect } from 'vitest'
import { trainingMax, pctSets, pctWeight, waveLabel, waveReps, usesPct, WAVES, WAVE_KEYS, TM_FACTOR } from './percent.js'

// 100 kg × 5 reps → Epley 100 · (1 + 5/30) = 116.7 → TM = 90 % → 105 kg (snapped to the 5 kg
// step a lower-body lift takes). The numbers below are all downstream of that one set.
const S = {
  unit: 'kg',
  workouts: [{ d: '2026-01-01', start: 1, entries: [{ id: '0043', sets: [{ w: 100, r: 5, done: true }], target: { sets: 1, reps: 5 } }] }],
}
const ex = { id: '0043' }
// A chest exercise takes the 2.5 kg step instead.
const S_CHEST = { unit: 'kg', workouts: [{ d: '2026-01-01', entries: [{ id: '0025', sets: [{ w: 60, r: 5, done: true }] }] }] }

describe('trainingMax', () => {
  it('derives 90 % of the best estimated 1RM, on a loadable weight', () => {
    const t = trainingMax(S, ex, 5)
    expect(t.source).toBe('e1rm')
    expect(t.from).toBeCloseTo(116.7, 1)
    expect(t.tm).toBe(105)             // 116.7 × 0.9 = 105.03 → the 5 kg step
  })

  it('takes a hand-set training max over the estimate', () => {
    expect(trainingMax(S, { ...ex, tm: 90 }, 5)).toEqual({ tm: 90, source: 'set' })
  })

  it('has no opinion when nothing has been lifted', () => {
    expect(trainingMax({ unit: 'kg', workouts: [] }, ex, 5)).toEqual({ tm: undefined, source: 'none' })
    expect(trainingMax(S, { id: '0099' }, 5).tm).toBeUndefined()
  })

  it('keeps the app-wide factor in one place', () => {
    expect(TM_FACTOR).toBe(0.9)
  })
})

describe('pctWeight', () => {
  it('snaps a percentage to the increment', () => {
    expect(pctWeight(105, 75, 5)).toBe(80)      // 78.75 → 80
    expect(pctWeight(105, 85, 5)).toBe(90)      // 89.25 → 90
    expect(pctWeight(105, 95, 5)).toBe(100)     // 99.75 → 100
    expect(pctWeight(100, 65, 2.5)).toBe(65)
  })

  it('survives a missing training max', () => {
    expect(pctWeight(undefined, 85, 5)).toBe(0)
  })
})

describe('pctSets', () => {
  it('resolves the 5/3/1 week into weights and reps', () => {
    const r = pctSets(S, { ...ex, wave: 'w3' }, { inc: 5 })
    expect(r.ok).toBe(true)
    expect(r.sets).toEqual([{ w: 80, r: 5 }, { w: 90, r: 3 }, { w: 100, r: 1 }])
    expect(r.tm).toBe(105)
    expect(r.source).toBe('e1rm')
    expect(r.why[0]).toContain('{0}')
  })

  it('produces all four weeks of the cycle from the same max', () => {
    const w1 = pctSets(S, { ...ex, wave: 'w1' }, { inc: 5 })
    const w2 = pctSets(S, { ...ex, wave: 'w2' }, { inc: 5 })
    const dl = pctSets(S, { ...ex, wave: 'deload' }, { inc: 5 })
    expect(w1.sets.map(s => s.w)).toEqual([70, 80, 90])     // 65/75/85 % of 105
    expect(w2.sets.map(s => s.w)).toEqual([75, 85, 95])     // 70/80/90 %
    expect(dl.sets.map(s => s.w)).toEqual([40, 55, 65])     // 40/50/60 %
    expect(w1.sets.map(s => s.r)).toEqual([5, 5, 5])
    expect(w2.sets.map(s => s.r)).toEqual([3, 3, 3])
    expect(w1.sets.every(s => s.w <= w1.tm * 0.9)).toBe(true)   // week 1 stays light
  })

  it('uses the increment the exercise actually takes', () => {
    const r = pctSets(S_CHEST, { id: '0025', wave: 'w1' })   // 60×5 → 70 est → TM 63 → 2.5 step
    expect(r.tm).toBe(62.5)
    expect(r.sets.map(s => s.w)).toEqual([40, 47.5, 52.5])
  })

  it('accepts a bare list of percentages, with the reps from the same config', () => {
    const r = pctSets(S, { ...ex, pct: [70, 80, 90], reps: 3 }, { inc: 5 })
    expect(r.ok).toBe(true)
    expect(r.sets.map(s => s.w)).toEqual([75, 85, 95])
    expect(r.sets.map(s => s.r)).toEqual([3, 3, 3])
    expect(r.wave).toBe(null)
  })

  it('refuses a percentage list that is not a percentage', () => {
    expect(pctSets(S, { ...ex, pct: [0, 120] }, { inc: 5 })).toBe(null)
    expect(pctSets(S, { ...ex, pct: ['half'] }, { inc: 5 })).toBe(null)
    expect(pctSets(S, { ...ex, pct: [] }, { inc: 5 })).toBe(null)
  })

  it('asks for no percentages when nothing was configured', () => {
    expect(pctSets(S, ex, { inc: 5 })).toBe(null)
    expect(pctSets(S, null, { inc: 5 })).toBe(null)
    expect(usesPct(ex)).toBe(false)
    expect(usesPct({ wave: 'w1' })).toBe(true)
    expect(usesPct({ pct: [70] })).toBe(true)
  })

  it('explains itself instead of prescribing nothing when there is no 1RM yet', () => {
    const r = pctSets({ unit: 'kg', workouts: [] }, { ...ex, wave: 'w1' }, { inc: 5 })
    expect(r.ok).toBe(false)
    expect(r.sets).toEqual([])
    expect(r.why[0]).toContain('estimated 1RM')
  })

  it('never prescribes more than the wave asks for, and never a negative weight', () => {
    WAVE_KEYS.forEach(k => {
      const r = pctSets(S, { ...ex, wave: k }, { inc: 5 })
      r.sets.forEach(s => { expect(s.w).toBeGreaterThanOrEqual(0); expect(s.r).toBeGreaterThan(0) })
      expect(r.sets.length).toBe(WAVES[k].sets.length)
    })
  })

  it('labels a wave for the config sheet', () => {
    expect(waveLabel('w3')).toBe('75 / 85 / 95 %')
    expect(waveReps('w3')).toBe('5 / 3 / 1')
    expect(waveLabel('nope')).toBe('')
  })
})
