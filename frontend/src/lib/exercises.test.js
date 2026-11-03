import { describe, it, expect } from 'vitest'
import { EXDB } from './exercises-data.js'
import { matchesQuery, searchGroups, fold, SEARCH_ALIASES } from './exercises.js'

const byName = name => EXDB.find(e => e.n === name)
const preacher = byName('barbell preacher curl')
const bench = byName('barbell bench press')
const lateral = byName('cable lateral raise')

describe('search synonyms', () => {
  it('finds the Scott curls by the word people actually use', () => {
    expect(preacher).toBeTruthy()
    // Every Spanish name for that bench says "banco Scott", so "predicador" is a synonym neither
    // the dataset nor the translations use. Searching it must still reach the movement — alone,
    // and in the phrase people actually type.
    expect(matchesQuery(preacher, 'predicador')).toBe(true)
    expect(matchesQuery(preacher, 'curl predicador')).toBe(true)
    expect(matchesQuery(preacher, 'curl predicador barbell')).toBe(true)
  })

  it('expands aliases per word, so the order of the name does not matter', () => {
    expect(searchGroups('curl predicador')).toEqual([['curl'], ['predicador', 'preacher']])
    // The dataset says "barbell preacher curl": the words are in the opposite order to the query,
    // which a whole-phrase substring match could never reach.
    expect(matchesQuery(preacher, 'predicador curl')).toBe(true)
  })

  it('keeps multi-word searches all-words', () => {
    // "curl" and "sentadilla" never describe the same movement. Any-word matching would return
    // every curl and every squat, which is not what was typed.
    expect(matchesQuery(preacher, 'curl sentadilla')).toBe(false)
    expect(matchesQuery(bench, 'bench press')).toBe(true)
  })

  it('folds accents and case, as the search field promises', () => {
    expect(fold('Jalón')).toBe('jalon')
    expect(matchesQuery(lateral, 'LATERAL')).toBe(true)
    expect(matchesQuery(lateral, 'lateral raise')).toBe(true)
  })

  it('keeps the alias table small and lowercase', () => {
    for (const [key, values] of Object.entries(SEARCH_ALIASES)) {
      expect(key).toBe(fold(key))
      values.forEach(v => expect(v).toBe(fold(v)))
    }
  })
})
