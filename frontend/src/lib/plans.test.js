import { describe, it, expect } from 'vitest'
import { PLAN_LIBRARY, planOf, planRoutines, applyPlan, missingPlanCount } from './plans.js'
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
    expect(slots('pplul')).toBe(5)
  })

  it('names the five pplul days Push, Pull, Legs, Upper and Lower — and each resolves', () => {
    const plan = planOf('pplul')
    expect(plan.routines.map(r => r.name)).toEqual(['Push', 'Pull', 'Legs', 'Upper', 'Lower'])
    // Every routine id in every routine resolves in the bundled dataset.
    for (const r of planRoutines(plan)) {
      expect(r.ex.length).toBeGreaterThan(0)
      for (const e of r.ex) {
        expect(EXIDX[e.id], `${r.name}/${e.id}`).toBeDefined()
        expect(e.weight).toBe(0)
      }
      expect(r.prog).toBe('double')
      expect(r.rir).toBe(2)
    }
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

  it('carries the progression policy the plan prescribes', () => {
    expect(planRoutines(planOf('fullbody'))[0].prog).toBe('greyskull')
    expect(planRoutines(planOf('upperlower'))[0].prog).toBe('double')
    // PPL logs 8–15 reps: double progression is the rule that fits a rep range the plan already
    // prescribes — it holds the load until the top is reached. Not a claim that linear is worse:
    // load and rep progression adapt similarly once volume-load is matched (Plotkin et al. 2022,
    // PeerJ, doi:10.7717/peerj.14142).
    expect(planRoutines(planOf('ppl'))[0].prog).toBe('double')
    // 5×5 has no policy on purpose: 3–6 rep barbell work is exactly what `linear` was written
    // for, so it takes the default rather than naming a rule.
    expect(planRoutines(planOf('strong5x5'))[0].prog).toBeUndefined()
  })

  it('carries an effort target so the session can say what to leave in reserve', () => {
    for (const plan of PLAN_LIBRARY) {
      for (const r of planRoutines(plan)) {
        expect(r.rir, plan.key).toBeGreaterThanOrEqual(0)
        expect(r.rir, plan.key).toBeLessThanOrEqual(5)
      }
    }
    // Hypertrophy work stops about two reps short; the load-driven novice program leaves three,
    // because the bar is already the limit on the next session.
    expect(planRoutines(planOf('upperlower'))[0].rir).toBe(2)
    expect(planRoutines(planOf('ppl'))[0].rir).toBe(2)
    expect(planRoutines(planOf('strong5x5'))[0].rir).toBe(3)
  })

  it('keeps the PPL note honest about six exercises a session', () => {
    // The note is a promise about the data. The pull day had five for a while — one vertical
    // pull, which left the lats under the volume they need — and nothing caught the drift.
    for (const r of planOf('ppl').routines) expect(r.ex).toHaveLength(6)
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

  it('tags created routines with the plan key', () => {
    const s = { routines: [], week: {} }
    applyPlan(s, plan)
    expect(s.routines.every(r => r.plan === plan.key)).toBe(true)
  })

  it('loading the same plan twice creates no duplicates and keeps the same ids', () => {
    const s = { routines: [], week: {} }
    const first = applyPlan(s, plan)
    const second = applyPlan(s, plan)
    expect(s.routines).toHaveLength(2)
    expect(second.map(r => r.id)).toEqual(first.map(r => r.id))
    expect(s.week).toEqual({ 1: first[0].id, 3: first[1].id, 5: first[0].id })
  })

  it('reuses untagged routines with the same name (created before tagging)', () => {
    const s = { routines: [{ id: 'old-a', name: 'Full Body A', ex: [] }, { id: 'old-b', name: 'Full Body B', ex: [] }], week: {} }
    applyPlan(s, plan)
    expect(s.routines).toHaveLength(2)
    expect(s.week[1]).toBe('old-a')
  })

  it('recreates only the routines the user deleted', () => {
    const s = { routines: [], week: {} }
    const [a] = applyPlan(s, plan)
    s.routines = s.routines.filter(r => r.id === a.id)
    applyPlan(s, plan)
    expect(s.routines).toHaveLength(2)
    expect(s.routines[0].id).toBe(a.id)
  })

  it('keeps user edits on a reused routine instead of overwriting them', () => {
    const s = { routines: [], week: {} }
    applyPlan(s, plan)
    s.routines[0].ex.push({ id: '0025', sets: 9, reps: 9, weight: 99 })
    applyPlan(s, plan)
    expect(s.routines[0].ex).toHaveLength(6)
  })

  it('reports how many routines are still missing', () => {
    const s = { routines: [], week: {} }
    expect(missingPlanCount(s, plan)).toBe(2)
    applyPlan(s, plan)
    expect(missingPlanCount(s, plan)).toBe(0)
    s.routines.pop()
    expect(missingPlanCount(s, plan)).toBe(1)
  })
})
