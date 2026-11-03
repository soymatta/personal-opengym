// Ready-made training plans — the shelf at the top of the Plan screen.
//
// A plan is declarative: which routines to create (with their exercises) and which weekday
// each routine lands on. Loading one is `applyPlan`, a pure function over a draft state, so
// the schedule a plan produces can be asserted in a test instead of clicked through.
//
// Why these four. Training a muscle at least twice a week beats once a week at equal volume
// (Schoenfeld, Ogborn & Krieger 2016, Sports Med, doi:10.1007/s40279-016-0543-8), and weekly set
// volume is the variable that predicts growth (Schoenfeld et al. 2017, J Sports Sci,
// doi:10.1080/02640414.2016.1210197; Baz-Valle et al. 2022, J Hum Kinet,
// doi:10.2478/hukin-2022-0017). How those sets are cut into days matters less: 67 untrained men
// randomized to a twice-per-week split or a four-times-per-week full body — equal weekly volume —
// gained the same strength and muscle thickness in eight weeks (Evangelista et al. 2021,
// Einstein (São Paulo), doi:10.31744/einstein_journal/2021AO5781). So the split is a scheduling
// decision — a way to distribute volume across the days you can actually hold — and the shelf is
// organised that way:
//
// `rir` is the effort target a routine hands to the session: reps the last set should leave in
// the tank. It is a field on the routine, not each exercise, because the whole session is run at
// one effort level — and because a per-exercise target is 20 numbers nobody would edit. Two
// meta-analyses agree the last few reps before failure are what drive growth, with the effect
// tapering off around 3–4 reps in reserve (Refalo et al. 2023, Sports Med,
// doi:10.1007/s40279-022-01784-y; Robinson et al. 2024, Sports Med,
// doi:10.1007/s40279-024-02069-2). So: 2 for hypertrophy work, 3 for a linear novice program
// where the load is already the limit.
//
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
      // `rir: 2` covers the two straight sets; the final AMRAP set is the documented exception
      // and is meant to be taken to failure (RIR 0).
      { name: 'Full Body A', emoji: 'dumbbell', prog: 'greyskull', rir: 2, ex: [['0043', 3, 5], ['0025', 3, 5], ['0027', 3, 5], ['0031', 2, 10], ['0472', 3, 10]] },
      { name: 'Full Body B', emoji: 'dumbbell', prog: 'greyskull', rir: 2, ex: [['0043', 3, 5], ['0091', 3, 5], ['0032', 1, 5], ['1326', 3, 6], ['0472', 3, 10]] }
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
      { name: 'Upper Body', emoji: 'pullup', prog: 'double', rir: 2, ex: [['0025', 4, 8], ['0027', 4, 8], ['0426', 3, 10], ['0652', 3, 10], ['0241', 3, 12], ['0031', 3, 12]] },
      { name: 'Lower Body', emoji: 'legs', prog: 'double', rir: 2, ex: [['0043', 4, 8], ['0085', 3, 10], ['0739', 3, 12], ['0586', 3, 12], ['0605', 4, 15]] }
    ],
    // Wed, Sat and Sun stay empty on purpose — Upper/Lower/rest/Upper/Lower/rest/rest.
    week: { 1: 0, 2: 1, 4: 0, 5: 1 }
  },
  {
    key: 'ppl',
    icon: 'dumbbell',
    name: 'Push / Pull / Legs',
    note: 'Mon Push · Wed Pull · Fri Legs. Six exercises a session — the plan Personal Open Gym has always shipped.',
    // Two changes from the fitness-coach audit, both in the data rather than the prose:
    //   · `prog: 'double'`. Load progression and rep progression produce similar hypertrophy and
    //     strength once volume-load is matched (Plotkin et al. 2022, PeerJ,
    //     doi:10.7717/peerj.14142), so this is not a claim that linear is worse. It is the rule
    //     that fits the range the plan already prescribes: hold the load until every set reaches
    //     the top of 8–15, then add weight and reset the reps.
    //   · a second vertical pull. The pull day had one, leaving the lats 4 sets a week — the
    //     lowest group in the volume dose-response (Schoenfeld et al. 2017, J Sports Sci,
    //     doi:10.1080/02640414.2016.1210197) and below the ~10–20 band (Baz-Valle et al. 2022,
    //     J Hum Kinet, doi:10.2478/hukin-2022-0017). The pull-up brings it to 7 direct sets and
    //     makes the pull day the six exercises the plan note promises.
    // Frequency stays 1×/muscle/week: with 3 days there is no way to hit a muscle twice without
    // becoming a different plan, and Schoenfeld et al. 2016 (Sports Med,
    // doi:10.1007/s40279-016-0543-8) already says that is the weaker choice. The 4-day
    // Upper/Lower plan is the recommendation when four days are available.
    routines: PPL_SPEC.map(([name, emoji, ex]) => ({ name, emoji, ex, prog: 'double', rir: 2 })),
    week: { 1: 0, 3: 1, 5: 2 }
  },
  {
    // The other half of "what should a beginner run": three lifts a session, squat every time,
    // and nothing that needs a coach to teach — the barbell-only linear program (Rippetoe's
    // Starting Strength and StrongLifts 5×5 are the same shape). It is the plan the app's
    // linear progression policy was written for, so it needs no `prog` of its own.
    key: 'strong5x5',
    icon: 'barbell',
    name: '5×5 · A / B',
    note: 'Squat every session. Mon + Fri: bench press and row, 5×5. Wed: overhead press 5×5 and a single heavy set of five deadlifts.',
    routines: [
      // Novices running a load-driven linear program stop with more in the tank: the bar is the
      // limit on the next session anyway, and grinding 5×5 to failure costs more recovery than it
      // returns. `rir: 3` gives the session a target without turning it into a max-out.
      { name: '5×5 A', emoji: 'barbell', rir: 3, ex: [['0043', 5, 5], ['0025', 5, 5], ['0027', 5, 5]] },
      { name: '5×5 B', emoji: 'barbell', rir: 3, ex: [['0043', 5, 5], ['0091', 5, 5], ['0032', 1, 5]] }
    ],
    week: { 1: 0, 3: 1, 5: 0 }
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
    ...(r.rir != null ? { rir: r.rir } : {}),
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
