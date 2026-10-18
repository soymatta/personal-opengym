import { describe, it, expect } from 'vitest'
import { buildAiExport, aiToNDJSON, aiFilename, readAnyImport, AI_FORMAT } from './data-export.js'

const state = () => ({
  unit: 'kg', lang: 'en', theme: 'dark', accent: 'lime', body: 'male',
  targetW: 75, restSec: 90, effort: 'rir',
  routines: [
    { id: 'r1', name: 'Push', ex: [
      { id: 'ex-reps', sets: 3, reps: 8, weight: 60, prog: 'linear', inc: 2.5, mode: 'reps' },
      { id: 'ex-time', sets: 2, sec: 45, mode: 'time' },
      { id: 'ex-cardio', sets: 1, min: 20, speed: 9, mode: 'cardio' },
    ] },
  ],
  week: { 1: 'r1' },
  workouts: [{
    id: 'w1', d: '2026-10-01', name: 'Push',
    start: Date.parse('2026-10-01T10:00:00Z'), end: Date.parse('2026-10-01T10:30:00Z'), vol: 960,
    entries: [
      { id: 'ex-reps', sets: [{ w: 60, r: 8, done: true }, { w: 60, r: 8 }, { w: 62.5, r: 7, done: true, rir: 1 }] },
    ],
    prs: ['ex-reps'],
  }],
  bodyweight: [{ d: '2026-10-01', w: 78.4 }, { d: '2026-09-24', w: 79.1 }],
  customEx: [{ id: 'my-ex', n: 'My Move' }],
})

describe('buildAiExport', () => {
  const ai = buildAiExport(state())

  it('stamps the format and version', () => {
    expect(ai.format).toBe(AI_FORMAT)
    expect(ai.version).toBe(1)
    expect(ai.units).toBe('kg')
  })

  it('flattens only completed sets, numbering them per exercise', () => {
    expect(ai.counts.sets).toBe(2)
    expect(ai.sets.map(s => s.set)).toEqual([1, 2])
    expect(ai.sets[0]).toMatchObject({ date: '2026-10-01', exerciseId: 'ex-reps', weight: 60, reps: 8, volume: 480, pr: true })
    expect(ai.sets[1]).toMatchObject({ weight: 62.5, reps: 7, rir: 1, volume: 437.5 })
    // `pr` marks every set of an exercise that set a record that session; the workout lists the ids
    expect(ai.sets[1].pr).toBe(true)
    expect(ai.workouts[0].prs).toEqual(['ex-reps'])
  })

  it('resolves exercise names, falling back to custom exercises then the id', () => {
    expect(buildAiExport({ ...state(), routines: [{ id: 'r', name: 'R', ex: [{ id: 'my-ex', sets: 1, reps: 5 }] }] })
      .routines[0].exercises[0].name).toBe('My Move')
    expect(ai.routines[0].exercises[0].name).toBe('ex-reps')
  })

  it('keeps mode-specific fields for reps / time / cardio', () => {
    const [reps, time, cardio] = ai.routines[0].exercises
    expect(reps).toMatchObject({ mode: 'reps', reps: 8, weight: 60, progression: 'linear', increment: 2.5 })
    expect(time).toMatchObject({ mode: 'time', seconds: 45 })
    expect(cardio).toMatchObject({ mode: 'cardio', minutes: 20, speed: 9 })
  })

  it('names the week days', () => {
    expect(ai.week.Monday).toMatchObject({ routineId: 'r1', routine: 'Push' })
    expect(ai.week.Tuesday).toBeNull()
  })

  it('gives a per-exercise chronological view and a schema block', () => {
    const rec = ai.byExercise.find(e => e.exerciseId === 'ex-reps')
    expect(rec.entries).toHaveLength(1)
    expect(rec.entries[0].sets).toHaveLength(2)
    expect(Object.keys(ai.schema).length).toBeGreaterThan(0)
  })

  it('carries the raw state so it round-trips', () => {
    expect(ai.state.routines[0].id).toBe('r1')
    expect(ai.state).not.toBe(state())   // deep copy, not the same reference
  })

  it('never mutates the input state', () => {
    const s = state()
    const before = JSON.stringify(s)
    buildAiExport(s)
    expect(JSON.stringify(s)).toBe(before)
  })
})

describe('aiToNDJSON', () => {
  it('emits one JSON object per completed set', () => {
    const lines = aiToNDJSON(buildAiExport(state())).trim().split('\n')
    expect(lines).toHaveLength(2)
    expect(JSON.parse(lines[0])).toMatchObject({ exerciseId: 'ex-reps', weight: 60, reps: 8 })
  })

  it('ends with a newline', () => {
    expect(aiToNDJSON(buildAiExport(state())).endsWith('\n')).toBe(true)
  })
})

describe('readAnyImport', () => {
  it('accepts an AI export and returns its state', () => {
    const ai = buildAiExport(state())
    const { state: s, kind } = readAnyImport(JSON.stringify(ai))
    expect(kind).toBe('ai')
    expect(s.routines[0].id).toBe('r1')
  })

  it('accepts a plain backup', () => {
    const { kind } = readAnyImport(JSON.stringify(state()))
    expect(kind).toBe('backup')
  })

  it('rejects a history export (not restorable)', () => {
    expect(() => readAnyImport(JSON.stringify({ opengym_history: 1, rows: [] }))).toThrow()
  })

  it('rejects invalid JSON', () => {
    expect(() => readAnyImport('not json')).toThrow()
  })
})

describe('aiFilename', () => {
  it('dates the file and honours the extension', () => {
    expect(aiFilename('ndjson')).toMatch(/^opengym-ai-export-\d{4}-\d{2}-\d{2}\.ndjson$/)
  })
})
