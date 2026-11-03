// The Push/Pull/Legs starter plan. Shared by the "Load starter plan" action in Settings
// and by the demo build, which seeds a history on top of exactly these routines.
import { uid } from './format.js'

const SPEC = [
  ['Push Day', 'barbell', [['0025', 4, 8], ['0047', 3, 10], ['0426', 3, 10], ['0334', 3, 12], ['0241', 3, 12], ['0251', 3, 10]]],
  // A second vertical pull on purpose: the pull-down alone is 4 sets of lats a week — the lowest
  // group in the volume dose-response (Schoenfeld et al. 2017, J Sports Sci,
  // doi:10.1080/02640414.2016.1210197), and below the ~10–20 band Baz-Valle et al. 2022 puts the
  // productive range in (J Hum Kinet, doi:10.2478/hukin-2022-0017). The two rows that follow
  // train the mid-back, not the lats. It also makes the pull day the six exercises the plan
  // note promises.
  ['Pull Day', 'pullup', [['2330', 4, 10], ['0027', 4, 8], ['1323', 3, 10], ['0652', 3, 8], ['0031', 3, 10], ['0313', 3, 12]]],
  ['Leg Day', 'legs', [['0043', 4, 8], ['0085', 3, 10], ['0739', 3, 12], ['0585', 3, 12], ['0586', 3, 12], ['0605', 4, 15]]]
]

// The raw spec, shared with the ready-made-plan library (lib/plans.js) so Push/Pull/Legs is
// described in exactly one place. [name, emoji, [[exerciseId, sets, reps], …]]
export const PPL_SPEC = SPEC

// Fresh routine objects (new ids) — [push, pull, legs]. Double progression is the rule the rep
// ranges ask for: hold the load until every set reaches the top, then add weight and reset reps.
// Each routine carries `rir: 2` as the session's effort target (see lib/plans.js for the why).
export const starterRoutines = () =>
  SPEC.map(([name, emoji, list]) => ({ id: uid(), name, emoji, prog: 'double', rir: 2, ex: list.map(([id, sets, reps]) => ({ id, sets, reps, weight: 0 })) }))
