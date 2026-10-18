import { test, expect } from '@playwright/test'

// The four things this batch added, tested where a unit test cannot reach: the wiring between
// the pure modules and the screens. The numbers themselves are covered in lib/*.test.js.
const base = {
  unit: 'kg', lang: 'en', restSec: 0, routines: [], week: {}, dayPlan: {}, customEx: [],
  workouts: [], bodyweight: [], injuries: [], notes: {}, measures: [], exWeights: {},
}

const seed = over => ({
  ...base, ...over,
  active: over.active === undefined ? null : over.active,
})

const load = (page, over) => page.addInitScript(
  s => { try { localStorage.setItem('gym_state_v1', JSON.stringify(s)) } catch { /* */ } },
  seed(over)
)
const state = page => page.evaluate(() => JSON.parse(localStorage.getItem('gym_state_v1')))

// A session with one bench press set prescribed at 100 kg, so the plate calculator has a real
// target to split.
const BENCH_SESSION = {
  id: 'a1', d: '2026-10-01', start: Date.parse('2026-10-01T10:00:00Z'),
  routineId: null, name: 'Freestyle', bw: null, cur: 0,
  entries: [{ id: '0025', target: { id: '0025', sets: 1, reps: 5, weight: 100 }, sets: [{ w: 100, r: 5, done: false }] }],
}

test('the plate calculator splits a target across the bar and says what is left over', async ({ page }) => {
  await load(page, { active: BENCH_SESSION })
  await page.goto('/#/workout')

  await page.getByRole('button', { name: 'Plate calculator' }).click()
  await expect(page.getByRole('heading', { name: 'Plate calculator' })).toBeVisible()

  // 100 kg = 20 kg bar + 40 per side = a 25 and a 15. Read the plate tags, not any text: the
  // bar chips (20 / 15 / 10 kg) carry the same numbers.
  const plates = page.locator('span.tag.nocap')
  await expect(plates).toHaveText(['25 kg', '15 kg'])
  await expect(page.getByText('On the bar')).toBeVisible()
  expect(await page.locator('.platevis').count()).toBe(2)

  // A weight the plates cannot make says so instead of rounding it away (21 = bar + nothing).
  // Scope to the row it belongs to: the sheet is not the only stepper in the app.
  const target = page.locator('.row', { hasText: 'Total weight' }).locator('input').first()
  await target.fill('21')
  await target.blur()
  await expect(page.getByText(/short of 21/)).toBeVisible()
  await expect(page.getByText('Empty bar — no plates needed.')).toBeVisible()
})

test('a note written on the exercise is saved and read back in the session', async ({ page }) => {
  await load(page, { active: BENCH_SESSION, notes: { '0025': 'Elbows at 45°, not flared' } })
  await page.goto('/#/workout')

  // Written elsewhere, read here — the point of the feature.
  await expect(page.locator('.progline').filter({ hasText: 'Elbows at 45' })).toBeVisible()

  await page.getByRole('button', { name: 'Details' }).click()
  // The note is the sheet's textarea — the weight and rep fields are textboxes too.
  const box = page.getByPlaceholder('Anything worth remembering')
  await box.fill('Pause on the chest')
  await box.blur()
  expect((await state(page)).notes['0025']).toBe('Pause on the chest')
})

test('measurements are logged from Stats and shown next to the weight', async ({ page }) => {
  await load(page, {})
  await page.goto('/#/stats')

  await expect(page.getByText('Waist, arms, chest', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Log' }).last().click()
  await expect(page.getByRole('heading', { name: 'Body measurements' })).toBeVisible()

  await page.getByLabel('Waist').fill('84')
  await page.getByRole('button', { name: 'Save', exact: true }).click()

  // Stored in centimetres whatever the profile shows, and on the day it was measured.
  const stored = await state(page)
  expect(stored.measures).toHaveLength(1)
  expect(stored.measures[0].v.waist).toBe(84)

  await expect(page.locator('.card').filter({ hasText: 'Measurements' }).getByText('84 cm')).toBeVisible()
})

test('a percentage wave drives the session weight, and the session explains where it came from', async ({ page }) => {
  // 100 kg × 5 on a squat estimates 116.7 → training max 105 kg → 75/85/95 % of it.
  await load(page, {
    notes: {},
    routines: [{ id: 'r1', name: 'Wave', emoji: 'barbell', ex: [{ id: '0043', sets: 3, reps: 5, weight: 0, wave: 'w3' }] }],
    week: { 1: 'r1' },
    workouts: [{
      d: '2026-09-28', start: Date.parse('2026-09-28T10:00:00Z'), routineId: 'r1', name: 'Wave',
      entries: [{ id: '0043', target: { id: '0043', sets: 1, reps: 5 }, sets: [{ w: 100, r: 5, done: true }] }],
    }],
  })
  // Sessions start from the Workout tab, which lists the routines that are not today's.
  await page.goto('/#/workout')
  await page.getByText('Wave').first().click()
  // Every session opens with the weigh-in, which is skippable.
  await page.getByRole('button', { name: 'Start without weighing in' }).click()

  await expect(page.getByText(/90 % of your best estimated 1RM/)).toBeVisible()
  // 75 / 85 / 95 % of the 105 kg training max, and the reps the wave prescribes alongside.
  const rows = await page.locator('.setrow').evaluateAll(rs => rs.slice(0, 3).map(r => {
    const n = r.querySelectorAll('.num')
    return [n[0]?.value, n[1]?.value]
  }))
  expect(rows).toEqual([['80', '5'], ['90', '3'], ['100', '1']])
})

// The narrowest phone, in the wordiest language: new sheets with new long labels are exactly
// where a translation overflows, and a gate on the locale files cannot see that — only pixels can.
test.describe('on a 320px phone in German', () => {
  test.use({ viewport: { width: 320, height: 640 } })

  // Anything visible whose box leaves the viewport, named, so a failure says what did it.
  const strays = page => page.evaluate(() => {
    const w = window.innerWidth, h = window.innerHeight
    return [...document.querySelectorAll('button, h2, h3, span, input, label, p')]
      .filter(el => {
        const r = el.getBoundingClientRect()
        if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') return false
        if (r.width === 0 || r.height === 0 || r.bottom < 0 || r.top > h) return false
        return r.right > w + 1 || r.left < -1
      })
      .map(el => `${(el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 30)} @ ${Math.round(el.getBoundingClientRect().right)}px`)
  })

  test('the plate calculator holds up, and speaks German rather than English', async ({ page }) => {
    await load(page, { lang: 'de', active: BENCH_SESSION })
    await page.goto('/#/workout')

    await page.getByRole('button', { name: 'Hantelscheiben-Rechner' }).click()
    await expect(page.getByRole('heading', { name: 'Hantelscheiben-Rechner' })).toBeVisible()
    await expect(page.getByText('Auf der Stange')).toBeVisible()
    await expect(page.getByText('On the bar')).toHaveCount(0)
    expect(await strays(page)).toEqual([])
  })

  test('the measurement sheet holds up, and speaks German rather than English', async ({ page }) => {
    // A fresh page, not a hash change: a hash-only goto is a same-document navigation, so an open
    // sheet stays open and swallows the next click.
    await load(page, { lang: 'de' })
    await page.goto('/#/stats')

    await expect(page.getByRole('heading', { name: 'Maße' })).toBeVisible()
    await page.getByRole('button', { name: 'Eintragen' }).last().click()
    await expect(page.getByRole('heading', { name: 'Körpermaße' })).toBeVisible()
    await expect(page.getByLabel('Taille')).toBeVisible()
    await expect(page.getByText('Body measurements')).toHaveCount(0)
    expect(await strays(page)).toEqual([])
  })
})
