import { describe, it, expect } from 'vitest'
import { exerciseRows, dayRows, exerciseRecords, exerciseVolumeSeries, toCSV, buildExerciseExport, buildDayExport } from './history-export.js'

const S = {
  unit: 'kg',
  customEx: [],
  workouts: [
    {
      id: 'w1', d: '2026-01-10', start: 1, name: 'Push', prs: ['0025'],
      entries: [{ id: '0025', sets: [{ w: 60, r: 10, done: true }, { w: 65, r: 8, done: true }, { w: 70, r: 5, done: false }] }],
    },
    {
      id: 'w2', d: '2026-01-12', start: 2, name: 'Push', prs: [],
      entries: [{ id: '0025', sets: [{ w: 67.5, r: 8, done: true, rir: 2 }] }, { id: 'other', sets: [{ w: 20, r: 10, done: true }] }],
    },
  ],
}

describe('exerciseRows', () => {
  it('returns one row per done set, chronological', () => {
    const rows = exerciseRows(S, '0025')
    expect(rows.length).toBe(3)
    expect(rows[0]).toMatchObject({ date: '2026-01-10', set: 1, w: 60, r: 10 })
    expect(rows[1]).toMatchObject({ date: '2026-01-10', set: 2, w: 65, r: 8 })
    expect(rows[2]).toMatchObject({ date: '2026-01-12', set: 1, w: 67.5, rir: 2 })
  })
  it('marks PR workouts', () => {
    const rows = exerciseRows(S, '0025')
    expect(rows[0].pr).toBe('PR')
    expect(rows[2].pr).toBe('')
  })
})

describe('dayRows', () => {
  it('flattens every exercise of the day', () => {
    const rows = dayRows(S, '2026-01-12')
    expect(rows.length).toBe(2)
    expect(rows[0].exerciseId).toBe('0025')
    expect(rows[1].exerciseId).toBe('other')
  })
  it('empty day gives no rows', () => {
    expect(dayRows(S, '2026-01-01')).toEqual([])
  })
})

describe('exerciseRecords', () => {
  it('summarises best weight and sessions', () => {
    const recs = exerciseRecords(S)
    const bench = recs.find(r => r.id === '0025')
    expect(bench.sets).toBe(3)
    expect(bench.sessions).toBe(2)
    expect(bench.bestW).toBe(67.5)
    expect(bench.bestWDate).toBe('2026-01-12')
  })
})

describe('exerciseVolumeSeries', () => {
  it('sums w×r per workout', () => {
    const pts = exerciseVolumeSeries(S, '0025')
    expect(pts.length).toBe(2)
    expect(pts[0].y).toBe(60 * 10 + 65 * 8)
  })
})

describe('toCSV', () => {
  it('quotes commas and quotes', () => {
    const csv = toCSV([{ a: 'x,y', b: 'q"q' }])
    expect(csv).toBe('a,b\n"x,y","q""q"\n')
  })
  it('empty rows give empty string', () => {
    expect(toCSV([])).toBe('')
  })
})

describe('builders', () => {
  it('exercise export carries scope and csv', () => {
    const b = buildExerciseExport(S, '0025')
    expect(b.scope).toBe('exercise')
    expect(b.count).toBe(3)
    expect(b.csv).toContain('date,workout,set')
  })
  it('day export carries date', () => {
    const b = buildDayExport(S, '2026-01-10')
    expect(b.scope).toBe('day')
    expect(b.date).toBe('2026-01-10')
    expect(b.count).toBe(2)
  })
})
