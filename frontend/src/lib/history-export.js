// Selective history export: per-exercise and per-day, serie by serie.
//
// Why this file exists: the app already had full-backup JSON export and plan-file
// sharing, but no way to answer "qué peso alcé en press banca cada día, serie a
// serie" ni exportarlo filtrado. Everything here is pure (state in -> rows out)
// so it is testable with vitest and reusable from Stats, History and Settings.

import { EXIDX } from './exercises.js'
import { modeOf } from './history.js'

export const EXPORT_FMT = 1

const exName = (S, id) => {
  if (EXIDX[id]) return EXIDX[id].n
  const c = (S.customEx || []).find(x => x.id === id)
  if (c) return c.n
  return id
}

// All DONE sets of one exercise, chronological, one row per set.
// Row: { date, workout, set, w, r, sec, min, speed, rir, rpe, vol, pr }
export function exerciseRows(S, exId) {
  const rows = []
  const workouts = [...(S.workouts || [])].sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : (a.start || 0) - (b.start || 0)))
  for (const w of workouts) {
    const en = (w.entries || []).find(e => e.id === exId)
    if (!en) continue
    const isPR = (w.prs || []).includes(exId)
    let n = 0
    for (const s of (en.sets || [])) {
      if (!s.done) continue
      n++
      rows.push({
        date: w.d,
        workout: w.name || '',
        set: n,
        w: s.w ?? '',
        r: s.r ?? '',
        sec: s.sec ?? '',
        min: s.min ?? '',
        speed: s.speed ?? '',
        rir: s.rir ?? '',
        rpe: s.rpe ?? '',
        vol: ((s.w || 0) * (s.r || 0)) || '',
        pr: isPR ? 'PR' : '',
      })
    }
  }
  return rows
}

// Every DONE set logged on one ISO day, across all workouts that day.
export function dayRows(S, iso) {
  const rows = []
  const workouts = (S.workouts || []).filter(w => w.d === iso)
  for (const w of workouts) {
    for (const en of (w.entries || [])) {
      let n = 0
      for (const s of (en.sets || [])) {
        if (!s.done) continue
        n++
        rows.push({
          date: w.d,
          workout: w.name || '',
          exercise: exName(S, en.id),
          exerciseId: en.id,
          set: n,
          w: s.w ?? '',
          r: s.r ?? '',
          sec: s.sec ?? '',
          min: s.min ?? '',
          speed: s.speed ?? '',
          rir: s.rir ?? '',
          rpe: s.rpe ?? '',
          vol: ((s.w || 0) * (s.r || 0)) || '',
        })
      }
    }
  }
  return rows
}

// Per-exercise summary for the "analyse my performance" view:
// best weight + date, best volume set, total sets/sessions, first/last date.
export function exerciseRecords(S) {
  const byEx = new Map()
  const workouts = [...(S.workouts || [])].sort((a, b) => (a.d < b.d ? -1 : 1))
  for (const w of workouts) {
    for (const en of (w.entries || [])) {
      const done = (en.sets || []).filter(s => s.done)
      if (!done.length) continue
      let rec = byEx.get(en.id)
      if (!rec) {
        rec = {
          id: en.id, name: exName(S, en.id),
          sessions: 0, sets: 0, totalVol: 0,
          bestW: 0, bestWDate: null, bestWReps: null,
          first: w.d, last: w.d,
        }
        byEx.set(en.id, rec)
      }
      rec.sessions++
      rec.last = w.d
      for (const s of done) {
        rec.sets++
        rec.totalVol += (s.w || 0) * (s.r || 0)
        if ((s.w || 0) > rec.bestW) {
          rec.bestW = s.w || 0
          rec.bestWDate = w.d
          rec.bestWReps = s.r ?? null
        }
      }
    }
  }
  return [...byEx.values()].sort((a, b) => b.sets - a.sets)
}

// Volume lifted per workout for one exercise (sum w×r of done sets).
export function exerciseVolumeSeries(S, exId) {
  const pts = []
  const workouts = [...(S.workouts || [])].sort((a, b) => (a.start || 0) - (b.start || 0))
  for (const w of workouts) {
    const en = (w.entries || []).find(e => e.id === exId)
    if (!en) continue
    const vol = (en.sets || []).reduce((a, s) => a + (s.done ? (s.w || 0) * (s.r || 0) : 0), 0)
    if (vol > 0) pts.push({ t: w.start, d: w.d, y: Math.round(vol * 10) / 10 })
  }
  return pts
}

const csvCell = v => {
  const s = String(v ?? '')
  return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

export function toCSV(rows) {
  if (!rows.length) return ''
  const cols = Object.keys(rows[0])
  return cols.join(',') + '\n' + rows.map(r => cols.map(c => csvCell(r[c])).join(',')).join('\n') + '\n'
}

export function buildExerciseExport(S, exId) {
  const rows = exerciseRows(S, exId)
  const name = exName(S, exId)
  return {
    opengym_history: EXPORT_FMT,
    scope: 'exercise',
    exerciseId: exId,
    exercise: name,
    unit: S.unit || 'kg',
    mode: modeOf({ id: exId }),
    exported: new Date().toISOString().slice(0, 10),
    count: rows.length,
    rows,
    csv: toCSV(rows),
  }
}

export function buildDayExport(S, iso) {
  const rows = dayRows(S, iso)
  return {
    opengym_history: EXPORT_FMT,
    scope: 'day',
    date: iso,
    unit: S.unit || 'kg',
    exported: new Date().toISOString().slice(0, 10),
    count: rows.length,
    rows,
    csv: toCSV(rows),
  }
}

export function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 5000)
}

const safeName = s => String(s || 'data').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'data'
// Shared so a routine exported as a file lands next to an exercise export without the two
// naming schemes drifting apart.
export { safeName }

export const exerciseFilename = (S, exId, ext) => `opengym-${safeName(exName(S, exId))}-${new Date().toISOString().slice(0, 10)}.${ext}`
export const dayFilename = (iso, ext) => `opengym-day-${iso}.${ext}`
