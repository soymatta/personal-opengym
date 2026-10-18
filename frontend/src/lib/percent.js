// Percentage programming — 5/3/1 on top of the progression engine.
//
// The engine in progression.js answers "what next", derived from what you lifted last time.
// This answers a different question: "what does the program say today", where the program is a
// list of percentages. The two never both drive one set — a percentage prescription wins the
// weight, and the reason line says so, because two prescriptions in one row is exactly the
// confusion this app avoids elsewhere.
//
// The training max is DERIVED, not stored: 90 % of the best estimated 1RM on record (Wendler's
// own convention — you train off 90 % of your true max). That means there is no cycle counter
// to drift out of sync with reality, no "month 4" to advance by hand, and a training max that
// follows the lifter instead of a calendar: a 5 kg PR on your squat raises every percentage
// that rides on it. `cfg.tm` overrides the derivation when the estimate is optimistic — which,
// on a high-rep set, it can be.
//
// The week within the wave is chosen, not counted. The app has no notion of "cycle started",
// and inventing one from the workout count would silently jump the wave for anybody who missed
// a week — so the routine names its week and the screen shows the numbers it produced.

import { best1RM, REP_CAP } from './onerm.js'

// 90 % of the estimate. Lower this if the estimate comes from high-rep sets.
export const TM_FACTOR = 0.9

// The four weeks of the wave. Reps are the prescription, `+` marking the set taken for as many
// reps as are left — the app logs the set either way, so only the target rep count matters here.
export const WAVES = {
  w1: { sets: [65, 75, 85], reps: [5, 5, 5] },
  w2: { sets: [70, 80, 90], reps: [3, 3, 3] },
  w3: { sets: [75, 85, 95], reps: [5, 3, 1] },
  deload: { sets: [40, 50, 60], reps: [5, 5, 5] }
}
export const WAVE_KEYS = Object.keys(WAVES)

const round1 = v => Math.round(v * 10) / 10
// Snap to a weight the plates can make — the same rule the progression engine uses.
function snap(v, step) {
  if (!(step > 0)) return round1(v)
  return round1(Math.round(v / step) * step)
}

/**
 * The weight to train off, for one exercise.
 *
 * An explicit `cfg.tm` wins (it is a decision the lifter made). Otherwise 90 % of the best
 * estimated 1RM on record, snapped to the increment — undefined when there is no 1RM yet, and
 * the caller falls back to the plain plan weight rather than inventing a number.
 */
export function trainingMax(S, cfg, inc) {
  if (cfg && cfg.tm > 0) return { tm: round1(cfg.tm), source: 'set' }
  const best = cfg && cfg.id ? best1RM(S, cfg.id) : null
  if (!best || !(best.est > 0)) return { tm: undefined, source: 'none' }
  return { tm: snap(best.est * TM_FACTOR, inc), source: 'e1rm', from: best.est }
}

/** One percentage of a training max, on a loadable weight. */
export const pctWeight = (tm, pct, inc) => snap((tm || 0) * pct / 100, inc)

/**
 * Resolve a percentage prescription into concrete sets.
 *
 * @param {object} S     state (for the 1RM history)
 * @param {object} cfg   exercise config: { id, wave|pct, tm?, inc? }
 * @param {object} [o]   { inc } — fallback increment from the caller
 * @returns {{ ok:boolean, why:any[], sets:{w:number,r:number}[], tm?:number, source?:string, wave?:string }|null}
 *   null when the config asks for no percentages at all.
 */
export function pctSets(S, cfg, o = {}) {
  if (!cfg) return null
  const wave = cfg.wave && WAVES[cfg.wave] ? cfg.wave : null
  // A bare list of percentages is accepted too, so a hand-written plan can say [70, 80, 90].
  const list = wave ? WAVES[wave].sets : (Array.isArray(cfg.pct) && cfg.pct.length ? cfg.pct.map(Number) : null)
  if (!list || !list.every(p => p > 0 && p <= 100)) return null

  const inc = cfg.inc > 0 ? cfg.inc : (o.inc > 0 ? o.inc : 2.5)
  const unit = S.unit || 'kg'
  const { tm, source, from } = trainingMax(S, cfg, inc)
  if (!(tm > 0)) {
    // No 1RM to work from: say so instead of silently training at zero.
    return { ok: false, why: ['No estimated 1RM yet — log a working set of this exercise and the percentages fill in.'], sets: [] }
  }

  const reps = wave ? WAVES[wave].reps : list.map(() => (cfg.reps > 0 ? cfg.reps : 5))
  const sets = list.map((p, i) => ({ w: pctWeight(tm, p, inc), r: reps[i] || reps[reps.length - 1] || 5 }))

  const why = source === 'set'
    ? ['Week of {0} % — off your training max of {1} {2}.', list.join('/'), tm, unit]
    : ['Week of {0} % — {1} {2} is 90 % of your best estimated 1RM ({3} {4}).', list.join('/'), tm, unit, round1(from), unit]
  return { ok: true, why, sets, tm, source, wave, pct: list, unit }
}

/** Human summary of a wave's percentages ("65 / 75 / 85 %"), for the config sheet. */
export const waveLabel = key => (WAVES[key] ? WAVES[key].sets.join(' / ') + ' %' : '')

/** The rep targets a wave prescribes, so the config sheet can show them as read-only. */
export const waveReps = key => (WAVES[key] ? WAVES[key].reps.join(' / ') : '')

/** Does this config ask for percentage programming at all? */
export const usesPct = cfg => !!(cfg && (cfg.wave || (Array.isArray(cfg.pct) && cfg.pct.length)))

// Re-exported so the config sheet can explain where the ceiling on a usable estimate comes from.
export { REP_CAP }
