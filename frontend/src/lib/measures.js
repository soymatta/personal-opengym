// Body measurements — the tape, next to the scale.
//
// Every value is stored in centimetres, whatever unit the profile is showing: a measurement is
// a fact about a body, not about a display preference, and storing what was typed would make a
// kg→lb switch silently reinterpret 34 as inches. The unit is applied on the way out only.
//
// The sites are a fixed list on purpose. Free-text site names cannot be translated, cannot be
// graphed along one axis, and turn "what changed since March" into a search problem.

export const SITES = ['neck', 'chest', 'waist', 'hips', 'thigh', 'arm']

// A tape measurement is not a body part, and some languages say it with a different word:
// the dataset's `waist` body part is German "Rumpf" / Chinese 腰腹, while the girth you measure is
// "Taille" / 腰围. So measurements get their own keys. Chest is spelled out because the short one
// is already taken by a muscle chip (`MUSCLE_NAME.chest = 'Chest'`, French "Pectoraux"), and a
// pectoral is not a number you read off a tape.
const SITE_LABEL = {
  neck: 'Neck', chest: 'Chest girth', waist: 'Waist', hips: 'Hips', thigh: 'Thigh', arm: 'Arm',
}
export const siteKey = site => SITE_LABEL[site] || site

// Metric profile → cm, imperial profile → inches. (Weight units double as the length unit
// switch: somebody training in lb measures their waist in inches.)
export const lenUnit = unit => (unit === 'lb' ? 'in' : 'cm')
export const toLen = (cm, unit) => {
  const v = Number(cm) || 0
  return unit === 'in' ? round1(v / 2.54) : round1(v)
}
export const toCm = (v, unit) => round1(unit === 'in' ? (Number(v) || 0) * 2.54 : Number(v) || 0)

const round1 = v => Math.round(v * 10) / 10
const byDate = (a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0)

/**
 * Write one site for one day. Returns a new array (pure), reusing the day's entry when it
 * exists and dropping days that end up empty, so deleting the last site of a day removes the
 * day rather than leaving a blank row in the history.
 */
export function setMeasure(measures, iso, site, cm) {
  const out = (measures || []).map(m => ({ ...m, v: { ...m.v } }))
  const day = out.find(m => m.d === iso)
  const v = Number(cm) || 0
  if (v > 0) {
    if (day) { day.v[site] = round1(v); day.t = Date.now() }
    else out.push({ d: iso, t: Date.now(), v: { [site]: round1(v) } })
  } else if (day) {
    delete day.v[site]
  }
  return out.filter(m => Object.keys(m.v).length > 0).sort(byDate)
}

export function clearMeasure(measures, iso, site) {
  return setMeasure(measures, iso, site, 0)
}

/** The newest recorded value for a site, or null. */
export function latestOf(measures, site) {
  const list = seriesOf(measures, site)
  return list.length ? list[list.length - 1] : null
}

/** Every recorded value for one site, oldest first — the shape a chart wants. */
export function seriesOf(measures, site) {
  return (measures || [])
    .filter(m => Number(m.v && m.v[site]) > 0)
    .map(m => ({ d: m.d, v: Number(m.v[site]) }))
    .sort(byDate)
}

/** First and last value on record for a site, with the difference — null when there is one. */
export function changeOf(measures, site) {
  const list = seriesOf(measures, site)
  if (list.length < 1) return null
  const first = list[0]
  const last = list[list.length - 1]
  return { from: first.v, to: last.v, diff: round1(last.v - first.v), sessions: list.length, since: first.d, on: last.d }
}

/** Which sites have anything recorded, in the canonical order. */
export const sitesIn = measures =>
  SITES.filter(s => (measures || []).some(m => Number(m.v && m.v[s]) > 0))
