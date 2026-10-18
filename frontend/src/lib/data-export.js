// AI-friendly export / import.
//
// One JSON file with everything: profile, routines (every exercise, set count, rep scheme
// and progression rule), the weekly schedule, and the full logged history — flattened to
// one record per set, with a per-exercise chronological view on top. It is designed to be
// read by a human or fed straight to an LLM: stable keys, ISO dates, explicit units, and a
// self-describing `schema` block. `aiToNDJSON()` emits the same sets as newline-delimited
// JSON, one object per line, which is the cheapest shape to paste into a model.
//
// The same file round-trips: it carries the raw app `state`, so importing it restores
// exactly what was exported (and older plain backups still import through readAnyImport).

import { EXIDX } from './exercises.js'
import { modeOf } from './history.js'
import { DAYN, todayISO } from './format.js'
import { t } from './i18n.js'

export const AI_FORMAT = 'opengym.ai-export'
export const AI_VERSION = 1
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

const clone = o => JSON.parse(JSON.stringify(o))

const exName = (S, id) => EXIDX[id]?.n || (S.customEx || []).find(c => c.id === id)?.n || id

/** Build the AI-friendly document from app state. Pure: state in, object out. */
export function buildAiExport(S) {
  const unit = S.unit || 'kg'

  const routines = (S.routines || []).map(r => ({
    id: r.id,
    name: r.name,
    exercises: (r.ex || []).map(e => {
      const mode = modeOf(e)
      const base = {
        id: e.id,
        name: exName(S, e.id),
        sets: e.sets ?? 1,
        mode,
        ...(e.prog ? { progression: e.prog } : {}),
        ...(e.inc ? { increment: e.inc } : {}),
        ...(e.repsMin != null ? { repsMin: e.repsMin } : {}),
      }
      if (mode === 'cardio') return { ...base, minutes: e.min ?? null, speed: e.speed ?? null }
      if (mode === 'time') return { ...base, seconds: e.sec ?? null, weight: e.weight ?? null }
      return { ...base, reps: e.reps ?? null, weight: e.weight ?? null }
    }),
  }))
  const routineName = {}
  routines.forEach(r => { routineName[r.id] = r.name })

  const week = {}
  WEEK_ORDER.forEach(d => {
    const rid = S.week?.[d]
    week[DAYN[d]] = rid ? { dayIndex: d, routineId: rid, routine: routineName[rid] || null } : null
  })

  // Flattened history: one record per completed set (the "AI-friendly" core).
  const sets = []
  const workouts = [...(S.workouts || [])]
    .sort((a, b) => (a.start || 0) - (b.start || 0))
    .map(w => {
      const prs = new Set(w.prs || [])
      const entries = (w.entries || []).map(en => {
        let setNo = 0
        const esets = (en.sets || []).filter(s => s.done).map(s => {
          setNo++
          const rec = {
            set: setNo,
            weight: s.w ?? null,
            reps: s.r ?? null,
            seconds: s.sec ?? null,
            minutes: s.min ?? null,
            speed: s.speed ?? null,
            rir: s.rir ?? null,
            rpe: s.rpe ?? null,
            volume: (s.w || 0) * (s.r || 0) || null,
            ...(prs.has(en.id) ? { pr: true } : {}),
          }
          sets.push({
            date: w.d,
            workoutId: w.id,
            workout: w.name || null,
            exerciseId: en.id,
            exercise: exName(S, en.id),
            unit,
            ...rec,
          })
          return rec
        })
        return { exerciseId: en.id, exercise: exName(S, en.id), sets: esets }
      })
      return {
        id: w.id,
        date: w.d,
        name: w.name || null,
        start: w.start ? new Date(w.start).toISOString() : null,
        end: w.end ? new Date(w.end).toISOString() : null,
        durationSec: w.start && w.end ? Math.round((w.end - w.start) / 1000) : null,
        volume: w.vol ?? null,
        unit,
        rating: w.rating ?? null,
        note: w.note ?? null,
        prs: [...prs],
        entries,
      }
    })

  // Per-exercise chronological view: weight / reps / seconds per day.
  const byId = new Map()
  for (const s of sets) {
    let rec = byId.get(s.exerciseId)
    if (!rec) { rec = { exerciseId: s.exerciseId, exercise: s.exercise, entries: [] }; byId.set(s.exerciseId, rec) }
    let day = rec.entries.find(e => e.date === s.date)
    if (!day) { day = { date: s.date, sets: [] }; rec.entries.push(day) }
    day.sets.push({ set: s.set, weight: s.weight, reps: s.reps, seconds: s.seconds, minutes: s.minutes, speed: s.speed, rir: s.rir, rpe: s.rpe, volume: s.volume, ...(s.pr ? { pr: true } : {}) })
  }

  const bodyweight = (S.bodyweight || []).map(b => ({ date: b.d, weight: b.w, unit }))

  return {
    format: AI_FORMAT,
    version: AI_VERSION,
    app: 'openGym',
    exported: new Date().toISOString(),
    units: unit,
    schema: {
      'profile': 'settings + goal',
      'routines[].exercises[]': 'id, name, sets, mode (reps|time|cardio), reps|seconds|minutes, weight, progression',
      'week': 'day name → routine scheduled that day (or null)',
      'sets[]': 'one record per completed set: date, exercise, set #, weight, reps|seconds|minutes, rir, rpe, volume, pr',
      'workouts[].prs': 'exercise ids that set a personal record that session; `pr` on a set marks a set of one of those exercises',
      'byExercise[]': 'per-exercise chronological sets per day',
      'bodyweight[]': 'date + weight',
    },
    profile: {
      unit,
      language: S.lang || 'en',
      theme: S.theme || 'dark',
      accent: S.accent || 'lime',
      body: S.body || 'male',
      targetWeight: S.targetW ?? null,
      restSec: S.restSec ?? 90,
      effortScale: S.effort || 'none',
    },
    routines,
    week,
    workouts,
    sets,
    byExercise: [...byId.values()],
    bodyweight,
    counts: {
      routines: routines.length,
      workouts: workouts.length,
      sets: sets.length,
      bodyweight: bodyweight.length,
    },
    // Round-trip payload: the exact app state, so importing this file restores everything.
    state: clone(S),
  }
}

/** Newline-delimited JSON: one object per line (the flattened sets), LLM-cheap to paste. */
export function aiToNDJSON(ai) {
  return ai.sets.map(s => JSON.stringify(s)).join('\n') + '\n'
}

export const aiFilename = (ext = 'json') => `opengym-ai-export-${todayISO()}.${ext}`

/**
 * Accept either an AI-friendly export or a plain backup and return a restorable state
 * object. Throws a friendly error if the file is neither.
 */
export function readAnyImport(text) {
  let data
  try { data = typeof text === 'string' ? JSON.parse(text) : text } catch (e) {
    throw new Error(t('the file isn’t valid JSON'))
  }
  if (data && data.format === AI_FORMAT && data.state && typeof data.state === 'object') {
    return { state: data.state, kind: 'ai' }
  }
  if (data && Array.isArray(data.workouts) && Array.isArray(data.routines)) {
    return { state: data, kind: 'backup' }
  }
  throw new Error(t('not a Personal Open Gym backup or AI export'))
}
