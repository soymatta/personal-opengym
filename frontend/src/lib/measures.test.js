import { describe, it, expect } from 'vitest'
import { SITES, siteKey, lenUnit, toLen, toCm, setMeasure, clearMeasure, latestOf, seriesOf, changeOf, sitesIn } from './measures.js'
import de from '../locales/de.js'
import es from '../locales/es.js'
import fr from '../locales/fr.js'
import hi from '../locales/hi.js'
import itLocale from '../locales/it.js'
import pt from '../locales/pt.js'
import zh from '../locales/zh.js'

// A measurement is not a body part and not a muscle, and some languages say the three with
// different words. Each row is [idioma, sitio, lo que dice la cinta, la palabra que NO es] —
// the bug this pins is the row that said "Rumpf" (torso) where the tape said Taille.
const GIRTH_NOT_ANATOMY = [
  ['de', 'waist', 'Taille', 'Rumpf'],        // grupo corporal del dataset
  ['zh', 'waist', '腰围', '腰腹'],             // grupo corporal del dataset
  ['fr', 'chest', 'Poitrine', 'Pectoraux'],  // chip muscular
  ['zh', 'chest', '胸围', '胸部'],             // chip muscular
]

describe('units', () => {
  it('stores centimetres and shows what the profile measures in', () => {
    expect(lenUnit('kg')).toBe('cm')
    expect(lenUnit('lb')).toBe('in')
    expect(toLen(80, 'kg')).toBe(80)
    expect(toLen(80, 'in')).toBe(31.5)      // 80 cm ≈ 31.5 in
    expect(toCm(31.5, 'in')).toBe(80)
    expect(toCm(80, 'kg')).toBe(80)
  })

  it('never lets a unit switch reinterpret a stored number', () => {
    // 34 in typed into an lb profile is 86.4 cm on disk; switching to kg shows 86.4, not 34.
    const stored = toCm(34, 'in')
    expect(stored).toBe(86.4)
    expect(toLen(stored, 'kg')).toBe(86.4)
    expect(toLen(stored, 'in')).toBe(34)
  })

  it('treats junk as zero rather than NaN', () => {
    expect(toCm('', 'kg')).toBe(0)
    expect(toCm(undefined, 'in')).toBe(0)
    expect(toLen(null, 'cm')).toBe(0)
  })
})

describe('setMeasure', () => {
  it('adds a day, then merges further sites into the same day', () => {
    let m = setMeasure([], '2026-03-01', 'waist', 84)
    expect(m).toEqual([{ d: '2026-03-01', t: expect.any(Number), v: { waist: 84 } }])
    m = setMeasure(m, '2026-03-01', 'arm', 36.5)
    expect(m.length).toBe(1)
    expect(m[0].v).toEqual({ waist: 84, arm: 36.5 })
  })

  it('overwrites the same site on the same day instead of duplicating it', () => {
    let m = setMeasure([], '2026-03-01', 'waist', 84)
    m = setMeasure(m, '2026-03-01', 'waist', 83.5)
    expect(m.length).toBe(1)
    expect(m[0].v.waist).toBe(83.5)
  })

  it('keeps days sorted and does not mutate the input', () => {
    const first = setMeasure([], '2026-03-10', 'waist', 84)
    const m = setMeasure(first, '2026-03-01', 'waist', 85)
    expect(m.map(x => x.d)).toEqual(['2026-03-01', '2026-03-10'])
    expect(first.length).toBe(1)
    expect(first[0].d).toBe('2026-03-10')
  })

  it('drops a day once its last site is cleared', () => {
    let m = setMeasure([], '2026-03-01', 'waist', 84)
    m = setMeasure(m, '2026-03-01', 'arm', 36)
    m = clearMeasure(m, '2026-03-01', 'arm')
    expect(m.length).toBe(1)
    expect(m[0].v).toEqual({ waist: 84 })
    m = clearMeasure(m, '2026-03-01', 'waist')
    expect(m).toEqual([])
  })

  it('ignores zero, negative and non-numeric values', () => {
    let m = setMeasure([], '2026-03-01', 'waist', 84)
    m = setMeasure(m, '2026-03-01', 'thigh', 0)
    m = setMeasure(m, '2026-03-01', 'calf', -3)
    m = setMeasure(m, '2026-03-01', 'hips', 'wide')
    expect(m[0].v).toEqual({ waist: 84 })
  })
})

describe('reading a series', () => {
  const M = [
    { d: '2026-01-01', v: { waist: 88, arm: 35 } },
    { d: '2026-02-01', v: { waist: 86 } },
    { d: '2026-03-01', v: { waist: 84.5, arm: 36 } },
  ]

  it('lists only the days that carry the site, oldest first', () => {
    expect(seriesOf(M, 'waist')).toEqual([
      { d: '2026-01-01', v: 88 }, { d: '2026-02-01', v: 86 }, { d: '2026-03-01', v: 84.5 },
    ])
    expect(seriesOf(M, 'arm').map(x => x.d)).toEqual(['2026-01-01', '2026-03-01'])
    expect(seriesOf(M, 'neck')).toEqual([])
  })

  it('reports the newest value and the change since the first', () => {
    expect(latestOf(M, 'waist')).toEqual({ d: '2026-03-01', v: 84.5 })
    expect(changeOf(M, 'waist')).toEqual({ from: 88, to: 84.5, diff: -3.5, sessions: 3, since: '2026-01-01', on: '2026-03-01' })
    expect(changeOf(M, 'neck')).toBe(null)
    expect(latestOf(M, 'neck')).toBe(null)
  })

  it('reports a single measurement as a change of zero, not as a crash', () => {
    const one = [{ d: '2026-01-01', v: { waist: 88 } }]
    expect(changeOf(one, 'waist')).toMatchObject({ from: 88, to: 88, diff: 0, sessions: 1 })
  })

  it('reports which sites have data, in the site order', () => {
    expect(sitesIn(M)).toEqual(['waist', 'arm'])
    expect(sitesIn([])).toEqual([])
    const all = [{ d: '2026-01-01', v: Object.fromEntries(SITES.map(s => [s, 30])) }]
    expect(sitesIn(all)).toEqual(SITES)
  })

  it('survives a missing or malformed state', () => {
    expect(seriesOf(undefined, 'waist')).toEqual([])
    expect(latestOf(null, 'waist')).toBe(null)
    expect(sitesIn(undefined)).toEqual([])
    expect(setMeasure(undefined, '2026-01-01', 'waist', 80).length).toBe(1)
  })
})

describe('measurement labels', () => {
  const LOCALES = { de, es, fr, hi, it: itLocale, pt, zh }

  it('carries a label for every site in every language', () => {
    for (const [lang, mod] of Object.entries(LOCALES)) {
      const dict = mod.default || mod
      for (const site of SITES) {
        const key = siteKey(site)
        expect(key, `${lang}: sitio ${site}`).toBeTruthy()
        expect(dict[key], `${lang} ${key}`).toBeTruthy()
      }
    }
  })

  it('names the girth, not the muscle or the body part it sits in', () => {
    for (const [lang, site, girth, anatomy] of GIRTH_NOT_ANATOMY) {
      const dict = LOCALES[lang].default || LOCALES[lang]
      expect(dict[siteKey(site)], `${lang} ${site}`).toBe(girth)
      expect(dict[siteKey(site)], `${lang} ${site}`).not.toBe(anatomy)
    }
    // Chest is spelled out because its short key would land on the muscle chip, so German — which
    // needs a different word for each — reads "Brustumfang" on the tape and "Brust" on the muscle.
    expect(siteKey('chest')).not.toBe('Chest')
    expect((de.default || de)[siteKey('chest')]).toBe('Brustumfang')
    expect((de.default || de)['Chest']).toBe('Brust')
  })
})
