import { describe, it, expect } from 'vitest'
import { cleanEx, routineFromSession, buildPlanBundle, parsePlan, planPrintHTML } from './plan-share.js'
import { t } from './i18n.js'

// A finished freestyle session: ids, the set count actually performed, and the targets the
// app prescribed. The third entry logged nothing, so it is not part of the routine.
const SESSION = {
  id: 'w1',
  d: '2026-02-03',
  name: 'Freestyle',
  entries: [
    { id: '0025', sets: [{ w: 60, r: 8 }, { w: 60, r: 8 }, { w: 60, r: 6 }], target: { sets: 3, reps: 8, weight: 60 } },
    { id: '0043', sets: [{ w: 100, r: 5 }], target: { sets: 3, reps: 5, weight: 100 }, sg: 7 },
    { id: '0605', sets: [], target: { sets: 3, reps: 15, weight: 20 } }
  ]
}

const ROUTINE_A = {
  id: 'rA', name: 'Push Day', emoji: 'barbell', prog: 'double',
  ex: [{ id: '0025', sets: 4, reps: 8, weight: 0 }]
}
const ROUTINE_B = {
  id: 'rB', name: 'Custom Day', emoji: 'dumbbell',
  ex: [{ id: 'mine-1', sets: 3, reps: 12, weight: 10 }]
}
const S = {
  unit: 'kg',
  routines: [ROUTINE_A, ROUTINE_B],
  week: { 1: 'rA', 4: 'rB', 6: 'ghost' },
  customEx: [
    { id: 'mine-1', n: 'Sled Push', bp: 'legs' },
    { id: 'mine-2', n: 'Unused', bp: 'chest' }
  ]
}

describe('routineFromSession', () => {
  it('turns a finished session into a routine', () => {
    const r = routineFromSession(SESSION, 'My Day', 'barbell')
    expect(r.name).toBe('My Day')
    expect(r.emoji).toBe('barbell')
    expect(r.id).toBeTruthy()
    expect(r.ex.map(e => e.id)).toEqual(['0025', '0043'])
  })

  it('saves the sets that were actually done, not the ones prescribed', () => {
    const r = routineFromSession(SESSION, 'x', 'barbell')
    expect(r.ex[0].sets).toBe(3)      // 3 logged, target said 3
    expect(r.ex[1].sets).toBe(1)      // 1 logged, target said 3 — the session wins
  })

  it('keeps the target scheme and superset link', () => {
    const r = routineFromSession(SESSION, 'x', 'barbell')
    expect(r.ex[0]).toMatchObject({ reps: 8, weight: 60 })
    expect(r.ex[1].sg).toBe(7)
  })

  it('drops exercises with nothing logged', () => {
    const r = routineFromSession(SESSION, 'x', 'barbell')
    expect(r.ex.find(e => e.id === '0605')).toBeUndefined()
  })

  it('survives an entry with no target', () => {
    const r = routineFromSession({ entries: [{ id: '0025', sets: [{ w: 20, r: 10 }] }] }, 'x', 'dumbbell')
    expect(r.ex).toHaveLength(1)
    expect(r.ex[0].sets).toBe(1)
  })

  it('handles an empty session without throwing', () => {
    expect(routineFromSession({}, 'x', 'dumbbell').ex).toEqual([])
  })
})

describe('cleanEx', () => {
  it('keeps a timed exercise timed — a dropped mode turns 45 s into 45 reps', () => {
    expect(cleanEx({ id: '0031', sets: 3, mode: 'time', sec: 45, weight: 10 }))
      .toMatchObject({ id: '0031', sets: 3, mode: 'time', sec: 45, weight: 10 })
  })

  it('keeps cardio duration and speed, and no reps', () => {
    const o = cleanEx({ id: 'c1', sets: 1, mode: 'cardio', min: 20, speed: 8.5 })
    expect(o).toMatchObject({ min: 20, speed: 8.5 })
    expect(o.reps).toBeUndefined()
  })

  it('drops zero weight so the file stays clean', () => {
    expect(cleanEx({ id: '0025', sets: 3, reps: 8, weight: 0 }).weight).toBeUndefined()
  })

  it('carries the progression settings a shared routine needs', () => {
    expect(cleanEx({ id: '0025', sets: 3, reps: 8, prog: 'greyskull', inc: 2.5, repsMin: 6, sg: 2 }))
      .toMatchObject({ prog: 'greyskull', inc: 2.5, repsMin: 6, sg: 2 })
  })
})

describe('buildPlanBundle', () => {
  it('produces a file parsePlan accepts, with only the referenced customs', () => {
    const b = buildPlanBundle(S, 'My Plan')
    expect(b.opengym_plan).toBe(1)
    expect(b.name).toBe('My Plan')
    expect(b.exported).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(b.routines.map(r => r.id)).toEqual(['rA', 'rB'])
    expect(b.customEx.map(c => c.id)).toEqual(['mine-1'])
    const parsed = parsePlan(JSON.stringify(b))
    expect(parsed.routineCount).toBe(2)
    expect(parsed.exerciseCount).toBe(2)
    expect(parsed.dropped).toBe(0)
  })

  it('keeps the week, dropping days that point at a routine that no longer exists', () => {
    expect(buildPlanBundle(S, '').week).toEqual({ 1: 'rA', 4: 'rB' })
  })

  it('narrows to a single routine and leaves the week out', () => {
    const b = buildPlanBundle(S, 'Push', ['rA'])
    expect(b.routines.map(r => r.id)).toEqual(['rA'])
    expect(b.week).toEqual({})
    expect(parsePlan(b).scheduledDays).toBe(0)
  })

  it('carries the customs a narrowed routine needs, and no more', () => {
    expect(buildPlanBundle(S, 'Custom', ['rB']).customEx.map(c => c.id)).toEqual(['mine-1'])
    expect(buildPlanBundle(S, 'Push', ['rA']).customEx).toEqual([])
  })

  it('never leaks workouts, weigh-ins or settings', () => {
    const withExtras = { ...S, workouts: [{ id: 'w1' }], weighIns: [{ id: 'x' }], restSec: 90 }
    const keys = Object.keys(buildPlanBundle(withExtras, 'x'))
    expect(keys.sort()).toEqual(['customEx', 'exported', 'name', 'opengym_plan', 'routines', 'week'])
  })

  it('does not mutate the state it reads', () => {
    const before = JSON.stringify(S)
    buildPlanBundle(S, 'x', ['rA'])
    expect(JSON.stringify(S)).toBe(before)
  })

  it('handles a state with no routines at all', () => {
    const b = buildPlanBundle({ unit: 'kg' }, 'Empty')
    expect(b.routines).toEqual([])
    expect(b.week).toEqual({})
  })
})

describe('planPrintHTML', () => {
  const h1 = html => html.match(/<h1>([^<]*)<\/h1>/)[1]

  it('puts the routine name in the title when printing one routine', () => {
    const html = planPrintHTML(S, 'Push Day', ['rA'])
    expect(h1(html)).toBe('Push Day')
    expect(html).toMatch(/<title>Push Day<\/title>/)
  })

  it('falls back to the generic title when the caller names nothing', () => {
    expect(h1(planPrintHTML(S, '', ['rA']))).toBe(t('Weekly Training Plan'))
  })

  it('does not label a narrowing printout "Routines" — the title already says which one', () => {
    expect(planPrintHTML(S, 'Push Day', ['rA'])).not.toContain(`<h3 class="block">${t('Routines')}</h3>`)
    expect(planPrintHTML(S, '', ['rA'])).not.toContain(`<h3 class="block">${t('Routines')}</h3>`)
  })

  it('keeps the block label where it earns its place: the whole plan', () => {
    expect(planPrintHTML(S, t('My plan'))).toContain(`<h3 class="block">${t('Routines')}</h3>`)
  })

  it('says whose printout this is, in the kicker', () => {
    expect(planPrintHTML(S, 'Push Day', ['rA'])).toContain('<div class="kicker">Personal Open Gym</div>')
  })

  it('escapes a routine name instead of letting it into the markup', () => {
    expect(h1(planPrintHTML(S, '<script>x</script>', ['rA']))).toBe('&lt;script&gt;x&lt;/script&gt;')
  })
})
