// The substitution rules are the fitness-coach agent's (see the header of replacements.js).
// These tests check them against the real dataset rather than fixtures, because the classifier
// reads exercise *names* — a hand-written fixture would pass while 1,300 real names did not.
import { describe, it, expect } from 'vitest'
import { EXDB } from './exercises.js'
import { equivalentsOf, swapEntry, patternOf, classOf, primaryOf, stanceOf } from './replacements.js'

const ex = n => {
  const e = EXDB.find(x => x.n === n)
  if (!e) throw new Error('dataset no longer has: ' + n)
  return e
}
const all = r => [...r.exact, ...r.similar]

describe('classifying an exercise', () => {
  it('reads the joint action off the name, most specific rule first', () => {
    expect(patternOf(ex('barbell bench press'))).toBe('horizontal-push')
    // "leg curl" is a knee flexion; the generic "curl" rule must not claim it.
    expect(patternOf(ex('lever lying leg curl'))).toBe('knee-flexion')
    expect(patternOf(ex('barbell alternate biceps curl'))).toBe('elbow-flexion')
    expect(patternOf(ex('cable lat pulldown full range of motion'))).toBe('vertical-pull')
    // A press with no movement word still reads as a push from its body part.
    expect(patternOf(ex('barbell decline wide-grip press'))).toBe('horizontal-push')
  })

  it('keeps cardio, holds and dynamic work in three different classes', () => {
    expect(classOf(ex('walking on incline treadmill'))).toBe('cardio')
    expect(classOf(ex('weighted front plank'))).toBe('static')
    expect(classOf(ex('barbell bench press'))).toBe('dynamic')
  })
})

describe('equivalentsOf', () => {
  it('only offers exercises that pass every hard filter', () => {
    for (const name of ['barbell bench press', 'barbell deadlift', 'barbell full squat',
      'cable lat pulldown full range of motion', 'weighted front plank',
      'walking on incline treadmill', 'barbell alternate biceps curl']) {
      const src = ex(name)
      const r = equivalentsOf(src)
      expect(r.exact.length, name).toBeGreaterThan(0)
      for (const { ex: cand } of r.exact) {
        expect(classOf(cand), `${name} → ${cand.n}`).toBe(classOf(src))
        expect(primaryOf(cand), `${name} → ${cand.n}`).toBe(primaryOf(src))
        expect(patternOf(cand), `${name} → ${cand.n}`).toBe(patternOf(src))
        if (['squat', 'hinge', 'horizontal-push', 'vertical-push', 'horizontal-pull', 'vertical-pull'].includes(patternOf(src))) {
          expect(stanceOf(cand), `${name} → ${cand.n}`).toBe(stanceOf(src))
        }
      }
    }
  })

  it('never offers the exercise itself, nor its other-gender twin', () => {
    const src = ex('kneeling plank tap shoulder (male)')
    const base = src.n.replace(/\s*\(male\)$/, '')
    const names = all(equivalentsOf(src)).map(x => x.ex.n.toLowerCase().replace(/\s*\((male|female)\)$/, ''))
    expect(names).not.toContain(base)
    expect(names).not.toContain(src.n)
  })

  it('never mixes cardio, holds and lifting', () => {
    const cardio = equivalentsOf(ex('walking on incline treadmill'))
    expect(cardio.exact.length).toBeGreaterThan(0)
    expect(cardio.exact.every(x => x.ex.bp === 'cardio')).toBe(true)

    const hold = equivalentsOf(ex('weighted front plank'))
    expect(hold.exact.every(x => classOf(x.ex) === 'static')).toBe(true)
    expect(all(hold).map(x => x.ex.n)).not.toContain('barbell bench press')

    const lift = equivalentsOf(ex('barbell bench press'))
    expect(all(lift).every(x => x.ex.bp !== 'cardio')).toBe(true)
  })

  it('stays inside the movement: a press is replaced by a press', () => {
    const r = equivalentsOf(ex('barbell bench press'))
    const names = r.exact.map(x => x.ex.n.toLowerCase())
    expect(names.some(n => /bench press|chest press|push-up|press/.test(n))).toBe(true)
    expect(names.some(n => /deadlift|squat|curl|run/.test(n))).toBe(false)
    expect(names).not.toContain('barbell bench press')
  })

  it('spreads the list across equipment instead of returning eight barbells', () => {
    const r = equivalentsOf(ex('barbell bench press'))
    const equipment = new Set(r.exact.map(x => x.ex.eq))
    expect(equipment.size).toBeGreaterThanOrEqual(4)
  })

  it('keeps "same muscle, different movement" in its own list', () => {
    const src = ex('barbell bench press')
    const r = equivalentsOf(src)
    expect(r.similar.length).toBeGreaterThan(0)
    for (const { ex: cand, why } of r.similar) {
      expect(primaryOf(cand)).toBe(primaryOf(src))
      if (why === 'movement') expect(patternOf(cand)).not.toBe(patternOf(src))
      else expect(patternOf(cand)).toBe(patternOf(src))
    }
    const exactIds = new Set(r.exact.map(x => x.ex.id))
    expect(r.similar.some(x => exactIds.has(x.ex.id))).toBe(false)
  })

  it('does not reach for a different prime mover', () => {
    const r = equivalentsOf(ex('barbell deadlift'))
    expect(all(r).map(x => x.ex.n)).not.toContain('barbell bench press')
    expect(r.exact.map(x => x.ex.n)).not.toContain('barbell glute bridge')
  })

  it('never offers a stretch as a substitute for a working set', () => {
    const r = equivalentsOf(ex('barbell bench press'))
    expect(all(r).some(x => /stretch/i.test(x.ex.n))).toBe(false)
  })

  it('flags a candidate that loads a joint the plan already warns about', () => {
    const src = ex('barbell bench press')
    expect(all(equivalentsOf(src)).every(x => x.risk.length === 0)).toBe(true)
    // The app warns about injuries rather than hiding movements, so the list does the same:
    // the row stays, carries the warning, and ranks below the ones that spare the joint.
    const hurt = equivalentsOf(src, { injuries: ['elbow'] })
    expect(hurt.exact.some(x => x.risk.includes('elbow'))).toBe(true)
    expect(hurt.exact.at(-1).risk.length).toBeGreaterThan(0)
  })

  it('handles an exercise it has never seen', () => {
    expect(equivalentsOf({ id: 'nope', n: 'mystery movement', bp: 'chest', tg: 'pectorals', sm: [], eq: 'barbell' }).exact.length)
      .toBeGreaterThan(0)
    expect(equivalentsOf(null)).toEqual({ exact: [], similar: [] })
  })
})

describe('swapEntry', () => {
  const bench = ex('barbell bench press')
  const dumbbell = ex('dumbbell bench press')
  const treadmill = ex('walking on incline treadmill')
  const plank = ex('weighted front plank')

  it('keeps sets, reps and the superset link, and clears the load', () => {
    const entry = {
      id: bench.id, sets: 4, reps: 6, weight: 80, mode: 'reps', sg: 'sg1',
      prog: 'linear', inc: 2.5, repsMin: 4, wave: '5/5/5', tm: 100,
    }
    expect(swapEntry(entry, dumbbell)).toEqual({
      id: dumbbell.id, sets: 4, reps: 6, weight: 0, mode: 'reps', sg: 'sg1',
    })
  })

  it('learns nothing about the old exercise', () => {
    const out = swapEntry({ id: bench.id, sets: 5, reps: 3, weight: 90, wave: '5/5/5', tm: 110 }, dumbbell)
    expect(out).not.toHaveProperty('wave')
    expect(out).not.toHaveProperty('tm')
    expect(out).not.toHaveProperty('prog')
  })

  it('carries a hold over as a hold', () => {
    const out = swapEntry({ id: plank.id, sets: 3, mode: 'time', sec: 60, weight: 10 }, plank)
    expect(out).toMatchObject({ sets: 3, mode: 'time', sec: 60, weight: 0 })
  })

  it('never carries a duration into a rep prescription, nor the reverse', () => {
    expect(swapEntry({ id: treadmill.id, sets: 2, min: 30, speed: 6 }, bench))
      .toEqual({ id: bench.id, sets: 2, mode: 'reps', reps: 10, weight: 0 })
    expect(swapEntry({ id: bench.id, sets: 3, reps: 8, weight: 60 }, treadmill))
      .toEqual({ id: treadmill.id, sets: 3, min: 20, speed: 8 })
  })

  it('leaves an unknown exercise id alone instead of losing the entry', () => {
    const entry = { id: 'gone', sets: 3, reps: 8, weight: 0 }
    expect(swapEntry(entry, 'does-not-exist')).toBe(entry)
  })
})
