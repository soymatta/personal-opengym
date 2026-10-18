import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

// A tiny but real state: one routine (scheduled Monday) and one logged workout with a single
// completed set. Enough for buildAiExport() to produce sets to export.
const SEED = {
  unit: 'kg', lang: 'en',
  routines: [{ id: 'r1', name: 'Push', emoji: '1f3cb', ex: [{ id: 'bench-press', sets: 3, reps: 8, weight: 60 }] }],
  week: { 1: 'r1' },
  workouts: [{
    id: 'w1', d: '2026-10-01', name: 'Push',
    start: Date.parse('2026-10-01T10:00:00Z'), end: Date.parse('2026-10-01T10:45:00Z'), vol: 1440,
    entries: [{ id: 'bench-press', sets: [{ w: 60, r: 8, done: true }, { w: 62.5, r: 6, done: true }] }],
    prs: ['bench-press'],
  }],
  bodyweight: [{ d: '2026-10-01', w: 78.4 }],
  customEx: [],
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.clear() } catch { /* */ } })
})

test('exports an AI-friendly JSON document that round-trips', async ({ page }) => {
  await page.addInitScript(s => { try { localStorage.setItem('gym_state_v1', JSON.stringify(s)) } catch { /* */ } }, SEED)

  await page.goto('/#/settings')

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /Export for AI \(JSON\)/ }).click(),
  ])

  const doc = JSON.parse(await readFile(await download.path(), 'utf8'))
  expect(doc.format).toBe('opengym.ai-export')
  expect(doc.counts.sets).toBe(2)
  expect(doc.sets[0]).toMatchObject({ exerciseId: 'bench-press', weight: 60, reps: 8, pr: true })
  // the raw state travels with it, so importing restores exactly what was exported
  expect(doc.state.routines[0].id).toBe('r1')
  expect(doc.week.Monday.routineId).toBe('r1')
})

test('exports NDJSON with one set per line', async ({ page }) => {
  await page.addInitScript(s => { try { localStorage.setItem('gym_state_v1', JSON.stringify(s)) } catch { /* */ } }, SEED)

  await page.goto('/#/settings')
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /Export for AI \(NDJSON\)/ }).click(),
  ])

  const text = await readFile(await download.path(), 'utf8')
  const lines = text.trim().split('\n')
  expect(lines).toHaveLength(2)
  const first = JSON.parse(lines[0])
  expect(first).toMatchObject({ date: '2026-10-01', weight: 60, reps: 8 })
})

test('imports an AI export back, replacing local data', async ({ page }) => {
  await page.goto('/#/settings')

  const payload = {
    format: 'opengym.ai-export', version: 1,
    state: { ...SEED, routines: [{ id: 'r9', name: 'Imported Routine', emoji: '1f3cb', ex: [] }], week: {} },
  }
  await page.locator('input[accept*="ndjson"]').setInputFiles({
    name: 'ai.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(payload)),
  })

  // The import is destructive, so it asks first.
  await expect(page.getByText('Import AI export?')).toBeVisible()
  await page.getByRole('button', { name: 'Import', exact: true }).click()

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('gym_state_v1')))
  expect(stored.routines.map(r => r.name)).toContain('Imported Routine')
})
