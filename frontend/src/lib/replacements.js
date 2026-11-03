// Which exercises can stand in for this one.
//
// The rules are the fitness-coach agent's, not invented here. The short version, with the
// evidence that makes each line a rule rather than a preference:
//
//   HARD FILTERS — a substitute has to be the same *task*, not merely the same muscle:
//     · same primary target muscle — a different prime mover is a different exercise;
//     · same joint action / movement pattern family — specificity is for the pattern, not
//       the tool (Saeterbakken et al. 2025, Sports Med, doi:10.1007/s40279-025-02225-2);
//     · same contraction class — dynamic ↔ dynamic, isometric hold ↔ isometric hold,
//       cardio ↔ cardio. Never crossed: isometric gains are joint-angle specific
//       (Kubo et al. 2019, Eur J Appl Physiol, doi:10.1007/s00421-019-04229-z);
//     · same stance (bilateral ↔ unilateral) and same ballistic intent for the compound
//       patterns, where the stability/velocity demand is part of the exercise.
//
//   RANKING — among the exercises that pass: shared synergists, then equipment, then body
//   part. Exercise choice changes *where* a muscle grows even when total growth is preserved
//   (Zabaleta-Korta et al. 2021, doi:10.3390/ijerph181910353; Maeo et al. 2024,
//   doi:10.1002/jcsm.13552), so the sheet says what matched instead of implying the swap is
//   invisible. EMG is never a signal (Vigotsky et al. 2017, doi:10.1519/JSC.0000000000001249).
//
// Strength work is the strict case: a set of five on a back squat transfers to the pattern,
// the ROM and the velocity it was trained at, so the pattern/stance filters are not relaxed
// there. The rules live in one place (`equivalentsOf`) and are unit-tested against the real
// dataset rather than against hand-written fixtures.

import { EXDB, EXIDX, isCardio } from './exercises.js'
import { musclesOf } from './muscles.js'
import { riskFor } from './injuries.js'
import { modeOf } from './history.js'

/* ------------------------------- classification ------------------------------- */

// Name → joint action. The dataset carries no movement field, so this reads the English
// name (stable, unlike the translations) with the most specific rule first: "leg curl" must
// be a knee flexion before "curl" can claim it as an elbow flexion.
const PATTERNS = [
  ['vertical-pull', /(pull[- ]?up|chin[- ]?up|pulldown|pull down|lat pull|muscle[- ]?up)/],
  ['horizontal-pull', /(\brow\b|rower|face pull|inverted row)/],
  ['vertical-push', /(overhead press|military press|shoulder press|arnold press|push press|z press|\bjerk\b|handstand|pike push|landmine press)/],
  ['horizontal-push', /(bench press|chest press|push[- ]?up|\bdip\b|\bfly\b|\bflye\b|pec deck|svend|floor press)/],
  ['rear-delt', /(rear delt|reverse fly|reverse flye|rear lateral|prone y)/],
  ['lateral-raise', /(lateral raise|side raise|scaption|lu raise)/],
  ['front-raise', /(front raise)/],
  ['knee-flexion', /(leg curl|hamstring curl|nordic|glute ham)/],
  ['knee-extension', /(leg extension|knee extension|sissy)/],
  ['squat', /(squat|leg press|hack|lunge|step[- ]?up|split squat|pistol|shrimp|sled push)/],
  // A hip thrust and a deadlift both extend the hip, but the resistance peaks at opposite ends
  // of the range — the profile is what makes them different exercises (see the header).
  ['hip-extension', /(hip thrust|glute bridge|bridge|frog pump|kickback|donkey kick|hip extension)/],
  ['hinge', /(deadlift|romanian|good morning|back extension|hyperextension|\bswing\b|pull[- ]?through|clean|snatch)/],
  ['calf', /(calf|heel raise|donkey raise)/],
  ['elbow-flexion', /(curl|preacher)/],
  ['elbow-extension', /(triceps|skull|pushdown|kickback|french press|overhead extension)/],
  // A plank with a twist is still a plank: the hold comes before the twist it adds.
  ['anti-extension', /(plank|dead bug|bird dog|ab wheel|rollout|hollow|body saw)/],
  ['rotation', /(external rotation|internal rotation|rotator cuff|twist|woodchop|wood chop|pallof|rotation)/],
  ['hip-flexion', /(leg raise|knee raise|hanging raise|reverse crunch|flutter|toe touch|v-?up|v-?sit|captain)/],
  ['spinal-flexion', /(crunch|sit[- ]?up)/],
  ['hip-abduction', /(abduction|abductor|clamshell|band walk|lateral walk)/],
  ['hip-adduction', /(adduction|adductor|copenhagen)/],
  ['carry', /(carry|farmer|suitcase|waiter walk)/],
]

// Names the rules above miss but the body part makes obvious ("wide-grip press" on a chest
// exercise is a horizontal push). Only consulted when no name rule matched.
const PRESS_FALLBACK = { chest: 'horizontal-push', shoulders: 'vertical-push' }

// The patterns where stance and velocity are part of the task itself. An isolation curl done
// one arm at a time is still the same stimulus; a split squat is not a back squat.
const COMPOUND = new Set(['squat', 'hinge', 'horizontal-push', 'vertical-push', 'horizontal-pull', 'vertical-pull', 'carry'])

// A stretch or a mobility drill trains nothing a working set trains, so it is never offered —
// even when its target muscle and its name's movement word would let it through.
const NOT_TRAINING = /(stretch|mobility|circles|foam roll|massage|yoga|pose\b|breathing|meditation)/

// Holds, carries and planks are logged by time and are angle-specific. They never swap with
// a dynamic set, which is why this class exists separately from `modeOf` (a routine entry can
// time a dynamic movement, but the movement itself is still dynamic).
const STATIC = /(plank|wall sit|isometric|\bhold\b|\bhang\b|dead hang|farmer|carry|hollow body|superman|l-?sit|bridge hold)/
const BALLISTIC = /(power clean|hang clean|clean and|clean pull|clean deadlift|snatch|swing|\bjerk\b|jump|throw|slam|push press|plyo|muscle[- ]?up)/

/** Joint action of an exercise, or null when the name matches nothing known. */
export function patternOf(ex) {
  if (!ex) return null
  if (ex.bp === 'cardio') return 'cardio'
  const n = String(ex.n || '').toLowerCase()
  const hit = PATTERNS.find(([, re]) => re.test(n))
  if (hit) return hit[0]
  return /\bpress\b/.test(n) ? (PRESS_FALLBACK[ex.bp] || null) : null
}

/** 'cardio' | 'static' | 'dynamic' — the hard filter that keeps three kinds of work apart. */
export function classOf(ex) {
  if (ex && ex.bp === 'cardio') return 'cardio'
  return STATIC.test(String((ex && ex.n) || '').toLowerCase()) ? 'static' : 'dynamic'
}

/** Bilateral or unilateral, for the compound patterns only. */
export function stanceOf(ex) {
  const n = String((ex && ex.n) || '').toLowerCase()
  return /(lunge|split squat|step[- ]?up|single[- ]?leg|one[- ]?arm|one arm|single[- ]?arm|unilateral|pistol|bulgarian|suitcase|side plank|bird dog)/.test(n)
    ? 'unilateral'
    : 'bilateral'
}

/** The prime mover, as a drawable muscle slug (see lib/muscles.js). Null for cardio. */
export function primaryOf(ex) {
  const m = musclesOf(ex)
  let best = null
  let top = 0
  for (const [k, v] of Object.entries(m)) if (v > top) { top = v; best = k }
  return best
}

// "barbell bench press (male)" / "… v. 2" is the same movement twice. The dataset ships those
// pairs for the animation, and offering both as two different replacements is noise.
const baseName = ex => String((ex && ex.n) || '').toLowerCase()
  .replace(/\s*\((male|female|back pov|side pov|front pov)\)\s*$/, '')
  .replace(/\s+v\.?\s*\d+$/, '')
  .trim()

const secondaryOf = ex => {
  const p = primaryOf(ex)
  return new Set(Object.keys(musclesOf(ex)).filter(k => k !== p))
}

/** How much two exercises share beyond the prime mover, 0…1 (Jaccard). */
function synergy(a, b) {
  const A = secondaryOf(a)
  const B = secondaryOf(b)
  if (!A.size || !B.size) return 0
  let shared = 0
  A.forEach(k => { if (B.has(k)) shared++ })
  return shared / (A.size + B.size - shared)
}

/* -------------------------------- equivalence -------------------------------- */

/**
 * Exercises that can replace `ex`.
 *
 * Returns `{ exact, similar }`:
 *   exact   — passed every hard filter: same target, movement, class, stance, intent.
 *   similar — same target muscle, different movement. Kept apart on purpose: it is a valid
 *             hypertrophy choice but a different stimulus, so the UI never labels it
 *             "equivalent".
 *
 * Each item is `{ ex, sameEquipment, shared, target, why, risk }`; `shared` is the secondary
 * muscles both train, `why` says why a `similar` entry is not in `exact` ('movement' or
 * 'demand'), and `risk` lists the injured joints the candidate loads (see lib/injuries.js).
 */
export function equivalentsOf(ex, { pool = EXDB, limit = 8, similarLimit = 4, injuries = [] } = {}) {
  const empty = { exact: [], similar: [] }
  if (!ex || !ex.id) return empty
  const cls = classOf(ex)
  const pattern = patternOf(ex)
  const primary = primaryOf(ex)
  const stance = stanceOf(ex)
  const ballistic = BALLISTIC.test(String(ex.n || '').toLowerCase())
  const base = baseName(ex)
  const seen = new Set()

  // Synergists first (they say how much of the same work the candidate does), then equipment
  // and body part as tie-breakers. Sharing words with the source keeps "bench press" above
  // "incline bench press" without hiding the variation.
  const score = c =>
    synergy(c.ex, ex) * 4 +
    (c.ex.eq === ex.eq ? 1.5 : 0) +
    (c.ex.bp === ex.bp ? 0.5 : 0) +
    likeness(c.ex, ex) +
    region(c.ex, ex) -
    // Never hide a movement the plan already warns about, but never recommend it first either.
    c.risk.length * 2.5
  const rank = (a, b) =>
    score(b) - score(a) || String(a.ex.n).localeCompare(String(b.ex.n), 'en')

  const exact = []
  const similar = []

  ;(pool || []).forEach(cand => {
    if (!cand || !cand.id || cand.id === ex.id) return
    const n = String(cand.n || '').toLowerCase()
    if (NOT_TRAINING.test(n)) return
    const name = baseName(cand)
    if (name === base || seen.has(name)) return
    if (classOf(cand) !== cls) return
    if (primaryOf(cand) !== primary) return

    const p = patternOf(cand)
    const isExact = p === pattern &&
      (!COMPOUND.has(pattern) || stanceOf(cand) === stance) &&
      (cls === 'cardio' || BALLISTIC.test(n) === ballistic)
    seen.add(name)

    const shared = [...secondaryOf(cand)].filter(m => secondaryOf(ex).has(m))
    const why = p !== pattern ? 'movement' : 'demand'
    const risk = injuries.length ? riskFor(cand, injuries).map(r => r.joint) : []
    const item = { ex: cand, sameEquipment: cand.eq === ex.eq, shared, target: primary, why, risk }
    if (isExact) exact.push(item)
    else similar.push(item)
  })

  exact.sort(rank)
  similar.sort(rank)
  return { exact: spread(exact, limit), similar: similar.slice(0, similarLimit) }
}

// How many words two names share — "barbell bench press" is closer to "barbell wide bench
// press" than to "incline bench press", and the ordering should say so.
function likeness(a, b) {
  const words = x => new Set(String(x.n || '').toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2))
  const A = words(a)
  const B = words(b)
  if (!A.size || !B.size) return 0
  let shared = 0
  A.forEach(w => { if (B.has(w)) shared++ })
  return shared / Math.max(A.size, B.size)
}

// Incline/decline/close-grip/… shift which part of the muscle is trained, so a candidate that
// adds a qualifier the source does not have is a worse match than one that adds none — the
// second ranking signal in the agent's rules is the muscle-length region, not the muscle name.
const MODIFIER = /\b(incline|decline|close[- ]?grip|wide[- ]?grip|reverse|guillotine|floor|seated|standing|lying|kneeling|one[- ]?arm|single[- ]?leg|hammer|preacher)\b/g

function region(cand, src) {
  const mods = x => new Set(String(x.n || '').toLowerCase().match(MODIFIER) || [])
  const have = mods(src)
  let extra = 0
  let shared = 0
  mods(cand).forEach(m => { if (have.has(m)) shared++; else extra++ })
  return shared * 0.5 - extra * 1.25
}

// A list of eight barbell bench variations answers "what else can I press?" with "the same
// barbell". Round one takes one exercise per equipment, round two a second one, and only then
// are the remaining slots filled in ranked order.
function spread(list, limit) {
  const out = []
  const per = {}
  for (let round = 1; round <= 2; round++) {
    for (const item of list) {
      if (out.length >= limit) return out
      if (out.includes(item)) continue
      const k = item.ex.eq || '—'
      if ((per[k] || 0) >= round) continue
      per[k] = (per[k] || 0) + 1
      out.push(item)
    }
  }
  for (const item of list) {
    if (out.length >= limit) break
    if (!out.includes(item)) out.push(item)
  }
  return out
}

/* ---------------------------------- swapping ---------------------------------- */

/**
 * One routine entry replaced by another exercise.
 *
 * The prescription survives, the load does not: sets, reps (or the hold/cardio duration) and
 * the superset link carry over — volume and effort are what the plan actually prescribes —
 * while `weight`, and every exercise-specific setting (`wave`, `tm`, `prog`, `inc`, `repsMin`)
 * are dropped. A training max or a percentage wave belongs to the movement it was measured on;
 * carrying it to a new exercise would prescribe a load nobody has ever lifted.
 */
export function swapEntry(entry, next) {
  const e = entry || {}
  const ex = typeof next === 'string' ? EXIDX[next] : next
  const id = ex && ex.id
  if (!id) return e
  const from = modeOf(e)
  const to = isCardio(id) ? 'cardio' : (from === 'time' ? 'time' : 'reps')
  const out = { id, sets: Math.max(1, Math.round(Number(e.sets) || 3)) }
  if (e.sg) out.sg = e.sg
  if (to === 'cardio') {
    out.min = Math.max(1, Math.round(Number(e.min) || 20))
    out.speed = Number(e.speed) || 8
  } else if (to === 'time') {
    out.mode = 'time'
    out.sec = Math.max(1, Math.round(Number(e.sec) || 45))
    out.weight = 0
  } else {
    out.mode = 'reps'
    out.reps = Math.max(1, Math.round(Number(e.reps) || 10))
    out.weight = 0
  }
  return out
}
