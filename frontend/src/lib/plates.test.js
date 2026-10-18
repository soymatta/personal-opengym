import { describe, it, expect } from 'vitest'
import { loadFor, flatLoad, barOf, nearestUnder, BARS } from './plates.js'

describe('loadFor', () => {
  it('loads a round kilo target with the biggest plates first', () => {
    const l = loadFor(100)
    expect(l.perSide).toEqual([{ p: 25, n: 1 }, { p: 15, n: 1 }])
    expect(l.loaded).toBe(100)
    expect(l.remainder).toBe(0)
    expect(flatLoad(l)).toEqual([25, 15])
  })

  it('counts plate pairs, not plates', () => {
    const l = loadFor(140)   // 20 bar + 2×60 → 2×25 + 2×10 per side? no: 60 = 25+25+10
    expect(l.loaded).toBe(140)
    expect(l.perSide).toEqual([{ p: 25, n: 2 }, { p: 10, n: 1 }])
    expect(flatLoad(l)).toEqual([25, 25, 10])
  })

  it('uses the small plates for a half-step target', () => {
    const l = loadFor(22.5)
    expect(l.perSide).toEqual([{ p: 1.25, n: 1 }])
    expect(l.loaded).toBe(22.5)
  })

  it('reports what it cannot load instead of rounding the target away', () => {
    const l = loadFor(21)      // 1 kg above the bar: below the smallest plate
    expect(l.perSide).toEqual([])
    expect(l.loaded).toBe(20)
    expect(l.remainder).toBe(1)
    expect(nearestUnder(21)).toBe(20)
    expect(nearestUnder(101)).toBe(100)
  })

  it('treats the bar itself as loaded and an empty bar as nothing to hang', () => {
    const l = loadFor(20)
    expect(l.perSide).toEqual([])
    expect(l.loaded).toBe(20)
    expect(l.remainder).toBe(0)
    expect(l.below).toBe(false)
  })

  it('flags a target lighter than the bar rather than loading negative plates', () => {
    const l = loadFor(15)
    expect(l.below).toBe(true)
    expect(l.perSide).toEqual([])
    expect(l.loaded).toBe(20)
    expect(l.remainder).toBe(-5)
  })

  it('handles zero, negative and non-numeric targets as the bare bar', () => {
    [0, -30, null, undefined, NaN, 'heavy'].forEach(t => {
      const l = loadFor(t)
      expect(l.perSide).toEqual([])
      expect(l.loaded).toBe(20)
    })
  })

  it('switches bar and plates with the unit', () => {
    expect(barOf('lb')).toBe(45)
    const l = loadFor(135, { unit: 'lb' })
    expect(l.perSide).toEqual([{ p: 45, n: 1 }])
    expect(l.loaded).toBe(135)
    const odd = loadFor(100, { unit: 'lb' })   // 27.5 per side
    expect(flatLoad(odd)).toEqual([25, 2.5])
    expect(odd.loaded).toBe(100)
  })

  it('takes a different bar — a 15 kg bar changes the answer, not the plates', () => {
    const l = loadFor(60, { bar: 15 })
    expect(l.bar).toBe(15)
    expect(flatLoad(l)).toEqual([20, 2.5])
    expect(l.loaded).toBe(60)
    expect(BARS.kg).toContain(15)
  })

  it('accepts a custom plate set (a home gym with no 1.25s)', () => {
    const l = loadFor(22.5, { plates: [25, 20, 10, 5, 2.5] })
    expect(flatLoad(l)).toEqual([])
    expect(l.remainder).toBe(2.5)
  })

  it('never returns a load above the target', () => {
    for (let t = 0; t <= 400; t += 0.5) {
      const l = loadFor(t)
      if (!l.below) expect(l.loaded).toBeLessThanOrEqual(t)
      // What the bar holds plus what is missing is always the weight that was asked for.
      expect(l.loaded + l.remainder).toBeCloseTo(t, 6)
    }
  })
})
