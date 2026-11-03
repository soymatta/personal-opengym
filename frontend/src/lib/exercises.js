import { EXDB } from './exercises-data.js'
import { t, getLang } from './i18n.js'
import ES from '../names/es.js'

export { EXDB }
export const EXIDX = {}
EXDB.forEach(e => { EXIDX[e.id] = e })
export const BODYPARTS = [...new Set(EXDB.map(e => e.bp))].sort()

// Equipment options present in a given list of exercises, most common first (issue #6).
// Deriving them from the *already filtered* list keeps the chip row short and means
// every body-part × equipment combination on screen has results behind it.
export function equipmentOf(list) {
  const c = {}
  list.forEach(e => { if (e.eq) c[e.eq] = (c[e.eq] || 0) + 1 })
  return Object.keys(c).sort((a, b) => c[b] - c[a] || (a < b ? -1 : 1))
}

// Custom (user-created) exercises live in synced state S.customEx (issue #11) and are
// merged into the id index here so every EXIDX[id] lookup keeps working unchanged.
let customIds = []
export function registerCustom(list) {
  customIds.forEach(id => delete EXIDX[id])
  customIds = (list || []).map(e => e.id)
  ;(list || []).forEach(e => { EXIDX[e.id] = e })
}
// Full searchable catalogue — customs first so your own exercises are easy to find.
export const allExercises = st => [...(st.customEx || []), ...EXDB]

// Media (images/GIFs) is ~140 MB the dataset ships separately, so nothing in this repo
// bundles it. Default to the same pinned CDN the demo uses — a bare `img/` resolves relative
// to the page, so a deploy with no env vars 404s every thumbnail. A build that serves its own
// copy sets VITE_IMG_BASE / VITE_GIF_BASE (see .env.example); a local media server is
// `VITE_IMG_BASE=img/` plus the dev proxy in vite.config.js.
const CDN = 'https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@7455efae41b330c265e7cd4b78dfa848e7ce5ebd/'
const IMG_BASE = import.meta.env.VITE_IMG_BASE || CDN + 'images/'
const GIF_BASE = import.meta.env.VITE_GIF_BASE || CDN + 'videos/'
export const imgSrc = ex => IMG_BASE + ex.img
export const gifSrc = ex => GIF_BASE + ex.gif

// Cardio exercises log time + speed instead of weight × reps.
export const isCardio = idOrEx => (typeof idOrEx === 'string' ? EXIDX[idOrEx] : idOrEx)?.bp === 'cardio'

// An id that resolves to nothing — a plan file built against a different exercise dataset,
// a custom exercise deleted on another device before the sync arrived — still has to
// render. A placeholder keeps it visible (and removable) instead of taking the whole view
// down on the first `ex.n`.
export const exOr = id => EXIDX[id] ||
  { id, n: t('Unknown exercise'), bp: '', tg: '', eq: '', sm: [], st: [], missing: true }

// What to call an exercise on screen. The dataset ships English names, so src/names/<lang>.js
// holds the hand-written translations; anything without an entry keeps its English name rather
// than an empty row. Sentence case either way — the dataset's names are all lowercase, so the
// display sites no longer need `text-transform: capitalize` (which would capitalise every word
// of a Spanish name: "Press De Banca Con Barra").
const NAMES = { es: ES }
export function exName(exOrId) {
  const id = typeof exOrId === 'string' ? exOrId : exOrId?.id
  const ex = typeof exOrId === 'string' ? exOr(exOrId) : exOrId
  const n = (id && NAMES[getLang()]?.[id]) || ex?.n || ''
  return n.charAt(0).toUpperCase() + n.slice(1)
}

/**
 * Fold a name for searching: lowercase, accents off.
 *
 * Both sides get folded, and that is the whole point: it lets "jalon" find "Jalón" and
 * "triceps" find "Extensión de tríceps". Nobody reaches for the accent key between sets, and
 * before this a Spanish speaker who typed the word without its accent got nothing back.
 */
export const fold = s => (s == null ? '' : String(s)).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

/**
 * Words people type that neither the dataset nor its translations use, mapped to a word that
 * does. Small on purpose — an alias is a guess at somebody's vocabulary, so it earns its place
 * with a real miss. "Predicador" is the one that got reported: the callout for it exists in the
 * dataset, but every Spanish name for that bench says "banco Scott", so the exercise could not
 * be found by the word most people use for it.
 */
export const SEARCH_ALIASES = {
  predicador: ['preacher'],   // curl en banco Scott
  estocadas: ['zancadas'],    // lunges, the other word for them
  abdomen: ['abdominal']      // every Spanish name the dataset has for these says "Abdominales"
}

/** One group per word in the query: the word itself plus any alias it carries.
 *
 *  Per word, not per whole query: somebody types "curl predicador" — but every Spanish name for
 *  that bench says "banco Scott", and the dataset's English name is "barbell preacher curl",
 *  where the words are in the opposite order. A whole-phrase alias table missed both. Matching a
 *  group when any of its options appears keeps the query all-words (a word still has to be
 *  there) while letting an alias stand in for the word the dataset does not use.
 */
export function searchGroups(q) {
  const f = fold(q).trim()
  if (!f) return []
  return f.split(/\s+/).map(word => [word, ...(SEARCH_ALIASES[word] || [])])
}

/**
 * Does one exercise answer to this query?
 *
 * Everything the row shows is searchable, including the *translated* body part and equipment.
 * The dataset's own tags are English, so searching "trapecio" or "barra" matched nothing even
 * though those are the words on screen in Spanish — the search read "traps" and "barbell".
 */
export function matchesQuery(ex, q) {
  const groups = searchGroups(q)
  if (!groups.length) return true
  const hay = fold([exName(ex), ex.n, t(ex.tg || ''), t(ex.bp || ''), t(ex.eq || ''), ex.desc || ''].join(' '))
  return groups.every(options => options.some(term => hay.includes(term)))
}
