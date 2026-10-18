import { describe, it, expect } from 'vitest'
import { PLAN_LIBRARY, planOf, planRoutines, applyPlan } from './plans.js'
import { EXIDX } from './exercises.js'

// Opening a shelf item must not be able to produce a blank routine: an id that stops
// resolving is exactly what a dataset bump would do to a plan nobody re-checked.
describe('PLAN_LIBRARY', () => {
  it('every exercise id resolves in the bundled dataset', () => {
    const unknown = []
    for (const plan of PLAN_LIBRARY) {
      for (const r of plan.routines) for (const [id] of r.ex) if (!EXIDX[id]) unknown.push(`${plan.key}/${r.name}/${id}`)
    }
    expect(unknown).toEqual([])
  })

  it('uses each plan key once and gives every plan an icon', () => {
    const keys = PLAN_LIBRARY.map(p => p.key)
    expect(new Set(keys).size).toBe(keys.length)
    for (const p of PLAN_LIBRARY) expect(p.icon).toBeTruthy()
  })

  it('only schedules days that point at a routine the plan creates', () => {
    for (const plan of PLAN_LIBRARY) {
      for (const [day, index] of Object.entries(plan.week)) {
        expect(Number(day), plan.key).toBeGreaterThanOrEqual(0)
        expect(Number(day), plan.key).toBeLessThanOrEqual(6)
        expect(plan.routines[index], `${plan.key} day ${day}`).toBeDefined()
      }
    }
  })

  it('describes every routine with sets, reps and at least one exercise', () => {
    for (const plan of PLAN_LIBRARY) {
      for (const r of plan.routines) {
        expect(r.name, plan.key).toBeTruthy()
        expect(r.ex.length, `${plan.key}/${r.name}`).toBeGreaterThan(0)
        for (const [id, sets, reps] of r.ex) {
          expect(EXIDX[id], `${plan.key}/${r.name}/${id}`).toBeDefined()
          expect(sets, `${plan.key}/${r.name}/${id}`).toBeGreaterThan(0)
          expect(reps, `${plan.key}/${r.name}/${id}`).toBeGreaterThan(0)
        }
      }
    }
  })

  it('trains every muscle at least twice a week in the plans that claim a frequency', () => {
    // The shelf's whole argument is frequency: the 3-day plan gets there by repeating A/B,
    // the 4-day plan by splitting upper/lower twice. A week that scheduled each routine once
    // would still look like a plan while quietly being once per muscle.
    const slots = k => Object.values(planOf(k).week).length
    expect(slots('fullbody')).toBe(3)
    expect(slots('upperlower')).toBe(4)
    expect(slots('ppl')).toBe(3)
  })
})

describe('planOf', () => {
  it('finds a plan by key and returns undefined for anything else', () => {
    expect(planOf('fullbody')).toBe(PLAN_LIBRARY[0])
    expect(planOf('nope')).toBeUndefined()
  })
})

describe('planRoutines', () => {
  it('gives every routine and exercise a fresh id', () => {
    const plan = planOf('fullbody')
    const [a, b] = planRoutines(plan)
    expect(a.id).not.toBe(b.id)
    expect(a.id).toBeTruthy()
  })

  it('keeps the set/rep scheme and starts at zero weight', () => {
    const plan = planOf('upperlower')
    const [upper] = planRoutines(plan)
    const first = upper.ex[0]
    expect(first).toMatchObject({ id: '0025', sets: 4, reps: 8, weight: 0 })
  })

  it('carries the progression policy only where the plan sets one', () => {
    expect(planRoutines(planOf('fullbody'))[0].prog).toBe('greyskull')
    expect(planRoutines(planOf('upperlower'))[0].prog).toBe('double')
    expect(planRoutines(planOf('ppl'))[0].prog).toBeUndefined()
  })

  it('does not mutate the shared library entry', () => {
    const plan = planOf('fullbody')
    planRoutines(plan)
    expect(plan.routines[0].ex[0]).toHaveLength(3)
    expect(plan.routines[0].id).toBeUndefined()
  })
})

describe('applyPlan', () => {
  const plan = planOf('fullbody')

  it('adds routines instead of wiping the ones already there', () => {
    const s = { routines: [{ id: 'mine', name: 'Mine', ex: [] }], week: {} }
    applyPlan(s, plan)
    expect(s.routines.map(r => r.name)).toEqual(['Mine', 'Full Body A', 'Full Body B'])
  })

  it('replaces the week so it describes exactly one schedule', () => {
    const s = { routines: [], week: { 0: 'old-sunday', 6: 'old-saturday' } }
    const [a, b] = applyPlan(s, plan)
    expect(s.week).toEqual({ 1: a.id, 3: b.id, 5: a.id })
  })

  it('keeps days the plan leaves as rest days empty, not stale', () => {
    const s = { routines: [], week: { 2: 'old-tuesday' } }
    applyPlan(s, plan)
    expect(s.week[2]).toBeUndefined()
  })

  it('tolerates a state with no routines yet', () => {
    const s = { week: {} }
    expect(applyPlan(s, plan)).toHaveLength(2)
    expect(s.routines).toHaveLength(2)
  })
})
