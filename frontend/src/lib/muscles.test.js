import { describe, it, expect } from 'vitest'
import {
  MUSCLES, INERT, MUSCLE_NAME, musclesOf, loadOf,
  loadOfWorkouts, loadOfRoutine, loadOfActive, levelsOf, rankOf,
} from './muscles.js'

// Every locale file the app ships (English is the source strings, so there is no en.js).
const packs = import.meta.glob('../locales/*.js', { eager: true })

describe('which muscles an exercise trains', () => {
  it('reads the target, collapsing the dataset spellings onto one muscle', () => {
    expect(musclesOf({ tg: 'Pectorals' })).toEqual({ chest: 1 })
    expect(musclesOf({ tg: 'lats' })).toEqual({ 'upper-back': 1 })
    expect(musclesOf({ tg: 'QUADS' })).toEqual({ quadriceps: 1 })
  })

  it('counts a supporting muscle at a fraction of the target', () => {
    expect(musclesOf({ tg: 'pectorals', sm: ['triceps', 'shoulders'] }))
      .toEqual({ chest: 1, triceps: 0.4, deltoids: 0.4 })
  })

  it('falls back to the body part when the target cannot be drawn', () => {
    // "cardiovascular system" has no place on a body map; the body part still does.
    expect(musclesOf({ tg: 'cardiovascular system', bp: 'chest' })).toEqual({ chest: 1 })
    expect(musclesOf({ tg: 'sternocleidomastoid', bp: '' })).toEqual({})
  })

  it('spreads a body part over its muscles so the weights still sum to one', () => {
    const m = musclesOf({ bp: 'upper legs' })
    expect(m).toEqual({ quadriceps: 0.4, hamstring: 0.35, gluteal: 0.25 })
    expect(Object.values(m).reduce((a, b) => a + b, 0)).toBeCloseTo(1)
  })

  it('takes no exercise at all without throwing', () => {
    expect(musclesOf()).toEqual({})
    expect(musclesOf(null)).toEqual({})
  })
})

describe('training load per muscle', () => {
  // 0025 barbell bench press: chest primary, triceps + shoulders supporting.
  const bench = { id: '0025', sets: 4 }

  it('weighs a set by the muscle it worked', () => {
    expect(loadOf([bench])).toEqual({ chest: 4, triceps: 1.6, deltoids: 1.6 })
    expect(loadOf([])).toEqual({})
    expect(loadOf([{ id: '0025', sets: 0 }])).toEqual({})
  })

  it('counts only the sets actually ticked off', () => {
    const workout = {
      entries: [{ id: '0025', sets: [{ done: true }, { done: true }, { done: false }] }],
    }
    expect(loadOfWorkouts([workout]).chest).toBe(2)
    expect(loadOfWorkouts([])).toEqual({})
  })

  it('can narrow to the hard sets, which is a different question', () => {
    const workout = {
      entries: [{ id: '0025', sets: [{ done: true, rpe: 9 }, { done: true }, { done: false, rpe: 10 }] }],
    }
    expect(loadOfWorkouts([workout]).chest).toBe(2)
    expect(loadOfWorkouts([workout], s => s.rpe != null).chest).toBe(1)
  })

  it('reads a routine and a workout in progress the same way', () => {
    expect(loadOfRoutine({ ex: [{ id: '0025', sets: 3 }, { id: '0025' }] }).chest).toBe(4)
    expect(loadOfRoutine(null)).toEqual({})
    expect(loadOfActive({ entries: [{ id: '0025', sets: [{ done: true }, { done: false }] }] }).chest).toBe(1)
    expect(loadOfActive(null)).toEqual({})
  })
})

describe('shading the body map', () => {
  it('buckets each muscle relative to the hardest-worked one', () => {
    const lv = levelsOf({ chest: 10, biceps: 5, triceps: 2.5, forearm: 0.1 })
    expect(lv.chest).toBe(4)
    expect(lv.biceps).toBe(2)
    expect(lv.triceps).toBe(1)
    // one set is always visible — a trained muscle never shades to nothing
    expect(lv.forearm).toBe(1)
  })

  it('shades nothing when nothing was trained', () => {
    const lv = levelsOf({})
    expect(MUSCLES.every(m => lv[m] === 0)).toBe(true)
    expect(Object.keys(lv)).toHaveLength(MUSCLES.length)
  })
})

describe('ranking what was trained against what was missed', () => {
  it('puts the hardest-worked first and the missed ones in body order', () => {
    const { worked, missed } = rankOf({ chest: 5, biceps: 2, calves: 1 })
    expect(worked).toEqual(['chest', 'biceps', 'calves'])
    expect(missed[0]).toBe('trapezius')
    expect(missed).not.toContain('chest')
    expect(worked.length + missed.length).toBe(MUSCLES.length)
  })
})

describe('the muscle vocabulary', () => {
  it('names every muscle the map draws, and only those', () => {
    MUSCLES.forEach(m => expect(typeof MUSCLE_NAME[m], m).toBe('string'))
    expect(Object.keys(MUSCLE_NAME)).toHaveLength(MUSCLES.length)
    expect(new Set(Object.values(MUSCLE_NAME)).size).toBe(MUSCLES.length)
  })

  it('never counts a drawn-but-inert part as a muscle', () => {
    INERT.forEach(m => expect(MUSCLES).not.toContain(m))
  })

  // These names reach the screen through t(MUSCLE_NAME[m]) — an indirection the locale
  // checker cannot see, because it only scans t('literal'). So the key it would miss is
  // pinned here instead: a muscle that renders in English is a bug in a translated UI.
  it('has every muscle name translated in every locale', () => {
    const langs = Object.keys(packs)
    expect(langs.length).toBe(7)
    langs.forEach(path => {
      const pack = packs[path].default
      MUSCLES.forEach(m => {
        expect(pack[MUSCLE_NAME[m]], `${path} · ${MUSCLE_NAME[m]}`).toBeTruthy()
      })
    })
  })
})
