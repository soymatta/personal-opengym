// Ready-made training plans — the shelf at the top of the Plan screen.
//
// A plan is declarative: which routines to create (with their exercises) and which weekday
// each routine lands on. Loading one is `applyPlan`, a pure function over a draft state, so
// the schedule a plan produces can be asserted in a test instead of clicked through.
//
// Why these three. The frequency evidence is consistent: training a muscle at least twice a
// week beats once a week at equal volume (Schoenfeld et al. 2016), and in a randomised trial
// of 67 untrained men a 4-day full-body routine and a 2-day-per-muscle split produced the
// same strength and thickness gains once weekly set volume was matched (Evangelista et al.
// 2021). So the split is a scheduling decision, and the shelf should be organised by how many
// days you can actually hold:
//   · Full Body   3 days — the beginner default, and the most forgiving: every muscle is
//                  trained three times a week, so a missed session still leaves two.
//   · Upper/Lower 4 days — the intermediate default: twice per muscle in four ~60 min sessions.
//   · Push/Pull/Legs 3 days — the plan openGym has always shipped, kept for continuity.
import { uid } from './format.js'
import { t } from './i18n.js'
import { PPL_SPEC } from './starter.js'

// Exercise ids come from the bundled dataset; plans.test.js fails if any of them stops
// resolving, which is what a dataset bump would do to a plan nobody re-checked.
export const PLAN_LIBRARY = [
  {
    key: 'fullbody',
    icon: 'figureStrength',
    name: 'Full Body · 3 days',
    note: 'Mon / Wed / Fri, alternating A and B. Every muscle three times a week — the most forgiving plan if you miss a day.',
    routines: [
      // Greyskull's rule (two straight sets plus a final set to failure) is what this split
      // was designed around: heavy full-body lifting three times a week needs a saner
      // progression than "add weight every session".
      { name: 'Full Body A', emoji: 'dumbbell', prog: 'greyskull', ex: [['0043', 3, 5], ['0025', 3, 5], ['0027', 3, 5], ['0031', 2, 10], ['0472', 3, 10]] },
      { name: 'Full Body B', emoji: 'dumbbell', prog: 'greyskull', ex: [['0043', 3, 5], ['0091', 3, 5], ['0032', 1, 5], ['1326', 3, 6], ['0472', 3, 10]] }
    ],
    week: { 1: 0, 3: 1, 5: 0 }
  },
  {
    key: 'upperlower',
    icon: 'pullup',
    name: 'Upper / Lower',
    note: 'Mon Upper · Tue Lower · Thu Upper · Fri Lower. Each muscle twice a week, in four sessions of about an hour.',
    routines: [
      // "double" turns each exercise into a rep range: `reps` is the top of the range and the
      // policy walks up to it before adding weight (bottom defaults to reps − 2).
      { name: 'Upper Body', emoji: 'pullup', prog: 'double', ex: [['0025', 4, 8], ['0027', 4, 8], ['0426', 3, 10], ['0652', 3, 10], ['0241', 3, 12], ['0031', 3, 12]] },
      { name: 'Lower Body', emoji: 'legs', prog: 'double', ex: [['0043', 4, 8], ['0085', 3, 10], ['0739', 3, 12], ['0586', 3, 12], ['0605', 4, 15]] }
    ],
    // Wed, Sat and Sun stay empty on purpose — Upper/Lower/rest/Upper/Lower/rest/rest.
    week: { 1: 0, 2: 1, 4: 0, 5: 1 }
  },
  {
    key: 'ppl',
    icon: 'dumbbell',
    name: 'Push / Pull / Legs',
    note: 'Mon Push · Wed Pull · Fri Legs. Six exercises a session — the plan Personal Open Gym has always shipped.',
    routines: PPL_SPEC.map(([name, emoji, ex]) => ({ name, emoji, ex })),
    week: { 1: 0, 3: 1, 5: 2 }
  }
]

export const planOf = key => PLAN_LIBRARY.find(p => p.key === key)

/** Fresh routine objects for a plan — new ids, routine names in the current language. */
export function planRoutines(plan) {
  return plan.routines.map(r => ({
    id: uid(),
    name: t(r.name),
    emoji: r.emoji,
    ...(r.prog ? { prog: r.prog } : {}),
    ex: r.ex.map(([id, sets, reps]) => ({ id, sets, reps, weight: 0 }))
  }))
}

/**
 * Load a plan into a draft state `s` (call inside store.update) and return the new routines.
 *
 * Routines are always ADDED — never overwritten — but the week IS replaced, for the same
 * reason mergePlan replaces it: a week that kept half the old days describes a schedule
 * neither the old plan nor the new one, and nothing on screen would say which is which.
 */
export function applyPlan(s, plan) {
  const routines = planRoutines(plan)
  s.routines = s.routines || []
  s.routines.push(...routines)
  const week = {}
  Object.entries(plan.week).forEach(([d, i]) => { if (routines[i]) week[d] = routines[i].id })
  s.week = week
  return routines
}
