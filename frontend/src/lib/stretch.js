// Guided stretching (Home -> "Stretching session").
//
// A pure selector over an exercise inventory (EXDB, or allExercises(S) so your own
// stretches count too): name-matched stretch holds split by focus, with an equipment
// filter. The session itself reuses the normal workout engine — each hold is a TIMED
// entry (30 s), so the work timer counts the hold and changeover uses the rest timer.
import { EXDB } from './exercises.js'

export const STRETCH_SEC = 30
export const STRETCH_COUNT = 7

// The catalogue has no 'hips' body part; hips work lives under upper legs.
const UPPER_BP = ['shoulders', 'chest', 'upper arms', 'neck']
const LOWER_BP = ['upper legs', 'lower legs']
// Bands on means the assisted apparatus counts too — not instead of bodyweight, which
// stays available either way. Stability balls, rollers and loaded variants need gear
// nobody was asked about, so they stay out of both pools.
const ASSISTED_EQ = ['band', 'cable', 'assisted', 'rope', 'resistance band']

// "outstretched" (single leg bridge) is not a stretch — anchor the word.
export const isStretch = ex => /\bstretch/i.test(ex.n || '')

function byId(a, b) {
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0
}

/**
 * Build one guided session: 6-8 timed holds, 30 s each.
 *
 * @param {Array} pool inventory to pick from (EXDB-shaped: { id, n, bp, eq })
 * @param {{ bands: boolean, type: 'upper' | 'lower' | 'full' }} opts
 * @returns {Array} routine-entry configs ({ id, sets: 1, sec: 30, weight: 0, mode: 'time' })
 */
export function buildStretchSet(pool, { bands, type }) {
  const all = (pool || EXDB).filter(isStretch)
  const eqOk = ex => (bands ? (ex.eq === 'body weight' || ASSISTED_EQ.includes(ex.eq)) : ex.eq === 'body weight')
  const upper = all.filter(ex => eqOk(ex) && UPPER_BP.includes(ex.bp)).sort(byId)
  const lower = all.filter(ex => eqOk(ex) && LOWER_BP.includes(ex.bp)).sort(byId)
  let picked
  if (type === 'upper') picked = upper
  else if (type === 'lower') picked = lower
  else {
    // full body: alternate sides so neither half starves when the pool is thin
    picked = []
    for (let i = 0; i < Math.max(upper.length, lower.length); i++) {
      if (upper[i]) picked.push(upper[i])
      if (lower[i]) picked.push(lower[i])
    }
  }
  return picked.slice(0, STRETCH_COUNT).map(ex => ({ id: ex.id, sets: 1, sec: STRETCH_SEC, weight: 0, mode: 'time' }))
}
