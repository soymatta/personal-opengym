import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import ES from './es.js'
import { EXIDX } from '../lib/exercises.js'
import { PLAN_LIBRARY } from '../lib/plans.js'

// The Spanish names are hand-written, so the risk is not a typo in a sentence — it is an id
// pointing at the wrong exercise, which would put the wrong movement on the row a user taps.
// Each entry carries the dataset's English name in a trailing comment and this file is parsed
// as source, so the comment is the assertion: a wrong id, a name typed from memory, or a
// duplicated id (which an object literal would silently swallow) all fail here.
const SOURCE = readFileSync(new URL('./es.js', import.meta.url), 'utf8')

const rows = []
for (const line of SOURCE.split('\n')) {
  const m = line.match(/^\s*'([^']+)':\s*'([^']*)',\s*\/\/ (.+?)\s*$/)
  if (m) rows.push({ id: m[1], es: m[2], en: m[3] })
}

describe('Spanish exercise names', () => {
  it('parses every entry in the file', () => {
    // A comment or a quote that breaks the shape would silently drop the entry from this
    // test — and with it the verification. So the count has to match what ships.
    expect(rows.length).toBe(Object.keys(ES).length)
    expect(rows.length).toBeGreaterThan(100)
  })

  it('has a unique row per id', () => {
    const ids = rows.map(r => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('points every id at the exercise its comment names', () => {
    const wrong = rows
      .filter(r => EXIDX[r.id]?.n !== r.en)
      .map(r => `${r.id}: comment says "${r.en}", dataset says "${EXIDX[r.id]?.n ?? 'NOTHING'}"`)
    expect(wrong).toEqual([])
  })

  it('translates rather than copies the English name', () => {
    // Names that are the English word in a Spanish gym too, so they are allowed to match — keeping
    // them in a list means the next accidental copy still fails.
    const LOANWORDS = ['0276', '1160', '0631', '3297', '3304']  // dead bug, burpee, muscle up, back lever, skin the cat
    const same = rows
      .filter(r => r.es.toLowerCase() === r.en.toLowerCase() && !LOANWORDS.includes(r.id))
      .map(r => `${r.id} (${r.en})`)
    expect(same).toEqual([])
  })

  it('covers every exercise the shipped plans prescribe', () => {
    // The three plans on the shelf are the exercises a brand-new user meets first, before
    // browsing anything. If one of them has no Spanish name, the first screen a Spanish
    // speaker sees is half English.
    const ids = new Set()
    for (const plan of PLAN_LIBRARY) {
      for (const r of plan.routines) for (const [id] of r.ex) ids.add(id)
    }
    const missing = [...ids].filter(id => !ES[id])
    expect(missing).toEqual([])
    expect(ids.size).toBeGreaterThan(15)
  })
})
