// Guards the strings check-locales.mjs cannot see.
//
// scripts/check-locales.mjs verifies the t('…') literals written in the source. But the UI also
// translates values passed through a variable — `t(plan.note)`, `t(DAYN[d])`, `t(ex.eq)`,
// `t(siteKey(site))` — and those never appear as a literal. When the data changes (a plan note
// gets reworded, a dataset tag is renamed) the new text silently renders in English in every
// language, and every gate stays green: locale parity is intact, the literal scan is intact.
//
// That is exactly how the 5×5 plan note drifted: plans.js was reworded, the locales kept the old
// key, and Plan.jsx showed English under a Spanish title. This test walks the data that reaches
// t() through a variable and asserts every value is carried by every locale.
import { describe, it, expect } from 'vitest'
import { DAYN, DAYS, MONTHS, MONTHS_LONG } from './format.js'
import { PLAN_LIBRARY } from './plans.js'
import { PPL_SPEC } from './starter.js'
import { JOINTS } from './injuries.js'
import { SITES, siteKey } from './measures.js'
import { EXDB } from './exercises-data.js'
import dePack from '../locales/de.js'
import esPack from '../locales/es.js'
import frPack from '../locales/fr.js'
import hiPack from '../locales/hi.js'
import itPack from '../locales/it.js'
import ptPack from '../locales/pt.js'
import zhPack from '../locales/zh.js'

const LOCALES = { de: dePack, es: esPack, fr: frPack, hi: hiPack, it: itPack, pt: ptPack, zh: zhPack }

// Every data-driven key the app renders through t(…).
const dataKeys = new Set([
  ...DAYN, ...DAYS, ...MONTHS, ...MONTHS_LONG,
  ...JOINTS,
  ...SITES.map(siteKey),
  ...PPL_SPEC.map(([name]) => name),
  ...EXDB.flatMap(e => [e.bp, e.eq, e.tg, e.mg, ...(e.sm || [])]).filter(Boolean),
])
for (const plan of PLAN_LIBRARY) {
  dataKeys.add(plan.name)
  dataKeys.add(plan.note)
  for (const r of plan.routines) dataKeys.add(r.name)
}

describe('data-driven translations', () => {
  it('covers the strings a plan, a weekday, a joint or a dataset tag renders', () => {
    expect(dataKeys.size).toBeGreaterThan(100)
  })

  it('carries every data-driven key in every locale', () => {
    const missing = []
    for (const [lang, dict] of Object.entries(LOCALES)) {
      for (const key of dataKeys) if (!(key in dict)) missing.push(`${lang}: ${JSON.stringify(key)}`)
    }
    expect(missing).toEqual([])
  })
})
