// Retune verification (ITEM 2) + suggestion-visibility proof (ITEM 3).
//
// Drives nextPrescription / applyPrescription with the real v2 backup state:
// the double-progression 8-12 shape, the hold/up engine claim, and the chain the
// workout screen reads its weight placeholders from (entry.plan -> sets).
import { describe, it, expect } from 'vitest'
import fs from 'fs'
import { readAnyImport } from './data-export.js'
import { EXIDX } from './exercises.js'
import { nextPrescription, applyPrescription } from './progression.js'
import { buildSets, modeOf } from './history.js'

const v2 = JSON.parse(fs.readFileSync(
  new URL('../../../opengym-backup-2026-11-10-v2.json', import.meta.url), 'utf8'))

// Every routine exercise paired with its routine (the policy reads the routine default).
const entries = v2.routines.flatMap(r => (r.ex || []).map(e => ({ cfg: e, routine: r })))
const firstCfg = id => entries.find(e => e.cfg.id === id)

describe('v2 backup', () => {
  it('reads as a backup through readAnyImport', () => {
    const { state, kind } = readAnyImport(JSON.stringify(v2))
    expect(kind).toBe('backup')
    expect(state.routines).toHaveLength(v2.routines.length)
    expect(state.workouts).toHaveLength(v2.workouts.length)
  })

  it('every routine exercise resolves in the catalogue', () => {
    for (const { cfg } of entries) expect(EXIDX[cfg.id], cfg.id).toBeTruthy()
  })

  it('every rep-mode exercise carries the 8-12 double-progression shape', () => {
    expect(entries.length).toBeGreaterThan(0)
    for (const { cfg } of entries) {
      expect(modeOf(cfg), cfg.id).toBe('reps')
      expect(cfg.reps, cfg.id).toBe(12)
      expect(cfg.repsMin, cfg.id).toBe(8)
    }
  })

  it('weights are the last session top working weights', () => {
    // 2026-11-05: 0739 went 80x12, 110x12, 130x10 -> top 130 (a miss, so hold)
    expect(firstCfg('0739').cfg.weight).toBe(130)
    // 2026-11-05: 0585 went 12,12,12 @16 -> top 16 (clean, so up)
    expect(firstCfg('0585').cfg.weight).toBe(16)
    // the swapped machines' predecessors (0047/0426/0334) were never logged: no invented load
    for (const id of ['1299', '0603', '0192']) expect(firstCfg(id).cfg.weight).toBe(0)
    // bodyweight-only work carries no external load
    for (const id of ['0251', '0652']) expect(firstCfg(id).cfg.weight).toBe(0)
  })
})

describe('progression engine on the v2 state', () => {
  it('holds the last working weight after a missed session (0739)', () => {
    const { cfg, routine } = firstCfg('0739')
    const p = nextPrescription(v2, cfg, routine)
    expect(p.kind).toBe('hold')
    expect(p.weight).toBe(130)
  })

  it('raises after a clean 12-rep session (0585)', () => {
    const { cfg, routine } = firstCfg('0585')
    const p = nextPrescription(v2, cfg, routine)
    expect(p.kind).toBe('up')
    // top 16 + the 5 kg lower-body step, snapped to a loadable 20
    expect(p.weight).toBe(20)
    expect(p.reps).toBe(8)
  })

  it('never answers off for a main lift', () => {
    for (const { cfg, routine } of entries) {
      const p = nextPrescription(v2, cfg, routine)
      expect(p.kind, cfg.id).not.toBe('off')
    }
  })
})

describe('suggestion chain (entry.plan -> weight placeholder)', () => {
  it('an Empuje exercise suggests weight+step in the built sets after a 12-rep session', () => {
    // 0241 has no history in v2, so log the session the rule needs: 3x12 clean at 30 kg.
    const S = JSON.parse(JSON.stringify(v2))
    S.workouts.push({
      id: 'w-synth', d: '2026-11-09', start: 1, end: 2, routineId: null, name: 'Empuje',
      entries: [{ id: '0241', target: { sets: 3, reps: 12 }, sets: [30, 30, 30].map(w => ({ w, r: 12, done: true })) }],
    })
    const { cfg, routine } = firstCfg('0241')
    const plan = nextPrescription(S, cfg, routine)
    expect(plan.kind).toBe('up')
    // 30 + the 2.5 kg upper-body step
    expect(plan.weight).toBe(32.5)
    const built = applyPrescription(buildSets(S, { ...cfg, id: '0241' }), plan)
    // every untouched row carries the suggestion — this is what the placeholder shows
    expect(built.length).toBe(3)
    for (const s of built) expect(s.w).toBe(plan.weight)
    // and the real-history case behaves the same way (0585 -> 20)
    const m = firstCfg('0585')
    const p58 = nextPrescription(v2, m.cfg, m.routine)
    const b58 = applyPrescription(buildSets(v2, { ...m.cfg, id: '0585' }), p58)
    expect(p58.weight).toBe(20)
    for (const s of b58) expect(s.w).toBe(20)
  })

  it('a first session carries no invented suggestion (swapped machines)', () => {
    const { cfg, routine } = firstCfg('1299')
    const plan = nextPrescription(v2, cfg, routine)
    expect(plan.kind).toBe('first')
    expect(plan.weight).toBeUndefined()
    expect(plan.reps).toBeUndefined()
    // the prescription touches nothing: rows fall back to the routine target, which is 0
    // and therefore renders no placeholder rather than a made-up number
    const built = buildSets(v2, { ...cfg, id: '1299' })
    expect(applyPrescription(built, plan)).toBe(built)
  })
})
