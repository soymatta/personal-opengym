import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

// One freestyle session, in progress: the exercise was prescribed 2 sets, a third was added
// mid-session, and only the first was checked — the state "finish early" is made for.
const seed = restSec => ({
  unit: 'kg', lang: 'en', restSec,
  routines: [], week: {}, dayPlan: {}, customEx: [], workouts: [], bodyweight: [],
  active: {
    id: 'a1', d: '2026-10-01', start: Date.parse('2026-10-01T10:00:00Z'),
    routineId: null, name: 'Freestyle', bw: null, cur: 0,
    entries: [{
      id: '0025', target: { id: '0025', sets: 2, reps: 8, weight: 60 },
      sets: [{ w: 60, r: 8, done: true }, { w: 60, r: 8, done: false }, { w: 60, r: 8, done: false }],
    }],
  },
})

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.clear() } catch { /* */ } })
})

const load = (page, state) => page.addInitScript(
  s => { try { localStorage.setItem('gym_state_v1', JSON.stringify(s)) } catch { /* */ } },
  state
)

test('a freestyle session can be saved as a routine you can repeat', async ({ page }) => {
  await load(page, seed(90))
  await page.goto('/#/workout')

  await page.getByRole('button', { name: 'Finish', exact: true }).click()
  // Two of three sets are still unchecked, so finishing is a decision the app asks about.
  await page.getByRole('button', { name: 'Finish workout', exact: true }).click()

  await page.getByLabel('Routine name').fill('My Push Day')
  await page.getByRole('button', { name: 'Save routine' }).click()

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('gym_state_v1')))
  const saved = stored.routines.find(r => r.name === 'My Push Day')
  expect(saved).toBeTruthy()
  expect(saved.ex).toHaveLength(1)
  expect(saved.ex[0].id).toBe('0025')
  // The session wins over the original prescription: the third set was added on the screen,
  // so it is part of what repeats — you meant to do three and stopped one in.
  expect(saved.ex[0].sets).toBe(3)
  expect(saved.ex[0].reps).toBe(8)
  expect(saved.ex[0].weight).toBe(60)
  // The session closed itself — saving does not leave a workout open behind it.
  expect(stored.active).toBe(null)
  // …and the saved routine is offered, not just stored: the app must say it worked.
  await expect(page.getByText('Saved to your routines')).toBeVisible()
})

test('the export button on a routine ships only that routine', async ({ page }) => {
  await load(page, {
    unit: 'kg', lang: 'en', restSec: 90, customEx: [], workouts: [],
    bodyweight: [{ d: '2026-10-01', w: 78.4 }],
    routines: [
      { id: 'r1', name: 'Push', emoji: '1f3cb', ex: [{ id: '0025', sets: 3, reps: 8, weight: 60 }] },
      { id: 'r2', name: 'Pull', emoji: '1f3cb', ex: [{ id: '0025', sets: 3, reps: 8, weight: 60 }] },
    ],
    week: { 1: 'r1', 3: 'r2' },
  })
  await page.goto('/#/plan/r/r1')

  await page.getByRole('button', { name: 'Export this routine' }).click()
  await expect(page.getByRole('heading', { name: 'Share this routine' })).toBeVisible()

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export routine file' }).click(),
  ])
  const doc = JSON.parse(await readFile(await download.path(), 'utf8'))

  // The file says which routine it is: a friend choosing between three downloads needs the name
  // inside the file, not only in its filename.
  expect(doc.name).toBe('Push')
  expect(doc.routines.map(r => r.name)).toEqual(['Push'])
  expect(doc.routines.map(r => r.id)).toEqual(['r1'])
  // "Routines only" is not a slogan: the week and everything personal must be absent, or a
  // friend importing the file inherits your schedule and your weigh-ins.
  expect(doc.week).toEqual({})
  expect(doc.workouts).toBeUndefined()
  expect(doc.bodyweight).toBeUndefined()
})

test('the whole-plan export names the plan it contains', async ({ page }) => {
  await load(page, {
    unit: 'kg', lang: 'en', restSec: 90, customEx: [], workouts: [],
    bodyweight: [{ d: '2026-10-01', w: 78.4 }],
    routines: [{ id: 'r1', name: 'Push', emoji: '1f3cb', ex: [{ id: '0025', sets: 3, reps: 8, weight: 60 }] }],
    week: { 1: 'r1' },
  })
  await page.goto('/#/plan')

  await page.getByRole('button', { name: 'Share your plan' }).click()
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export plan file' }).click(),
  ])
  const doc = JSON.parse(await readFile(await download.path(), 'utf8'))

  // An unnamed bundle is a file nobody can tell apart from the next one.
  expect(doc.name).toBe('My plan')
  expect(doc.week).toEqual({ 1: 'r1' })
})

const plan = {
  unit: 'kg', lang: 'en', restSec: 90, customEx: [], workouts: [], bodyweight: [],
  routines: [{ id: 'r1', name: 'Push', emoji: '1f3cb', ex: [{ id: '0025', sets: 3, reps: 8, weight: 60 }] }],
  week: {}, dayPlan: {},
}

test('a routine exercise can be swapped for an equivalent without losing the prescription', async ({ page }) => {
  await load(page, plan)
  await page.goto('/#/plan/r/r1')

  await page.locator('.list .item').first().click()
  await page.getByRole('button', { name: 'Replace exercise' }).click()
  await expect(page.getByRole('heading', { name: 'Replace Barbell bench press' })).toBeVisible()

  await page.locator('.sheet .item').filter({ hasText: 'Dumbbell bench press' }).first().click()

  await expect(page.locator('.list .item').first()).toContainText('Dumbbell bench press')
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('gym_state_v1')))
  // Sets and reps survive the swap; the load does not — 60 kg on a barbell bench says nothing
  // about what you can dumbbell press.
  expect(stored.routines[0].ex[0]).toMatchObject({ id: '0289', sets: 3, reps: 8, weight: 0, mode: 'reps' })
})

test('the replacement sheet searches the whole library, not just equivalents', async ({ page }) => {
  await load(page, plan)
  await page.goto('/#/plan/r/r1')

  await page.locator('.list .item').first().click()
  await page.getByRole('button', { name: 'Replace exercise' }).click()
  await expect(page.getByRole('heading', { name: 'Replace Barbell bench press' })).toBeVisible()

  const sheet = page.locator('.sheet')
  // Empty query shows the curated equivalents, unchanged.
  await expect(sheet.locator('.item').filter({ hasText: 'Dumbbell bench press' }).first()).toBeVisible()
  // A typed query searches the whole library instead — a lateral raise is no bench-press
  // equivalent, but the search still finds it.
  await sheet.getByPlaceholder('Search…').fill('cable one arm lateral raise')
  await expect(sheet.getByRole('heading', { name: 'Search results' })).toBeVisible()
  await expect(sheet.locator('.item').filter({ hasText: 'Dumbbell bench press' })).toBeHidden()
  await sheet.locator('.item').filter({ hasText: 'Cable one arm lateral raise' }).first().click()

  await expect(page.locator('.list .item').first()).toContainText('Cable one arm lateral raise')
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('gym_state_v1')))
  // The prescription survives the jump across movements, like any other swap.
  expect(stored.routines[0].ex[0]).toMatchObject({ id: '0192', sets: 3, reps: 8, weight: 0, mode: 'reps' })
})

test('the exercise library offers replacements too', async ({ page }) => {
  await load(page, plan)
  await page.goto('/#/library')
  await page.getByPlaceholder('Search…').fill('barbell bench press')
  await page.locator('.item').filter({ hasText: 'Barbell bench press' }).first().click()

  await page.getByRole('button', { name: 'Find a replacement' }).click()
  await expect(page.getByRole('heading', { name: 'Replace Barbell bench press' })).toBeVisible()

  const sheet = page.locator('.sheet')
  expect(await sheet.locator('.item').count()).toBeGreaterThan(2)
  // Never a different lift wearing the same muscle's name.
  await expect(sheet).not.toContainText('Barbell deadlift')

  // From the library a pick browses rather than replaces: the candidate's own detail opens.
  const first = await sheet.locator('.item .tt').first().innerText()
  await sheet.locator('.item').first().click()
  await expect(page.getByRole('heading', { name: first })).toBeVisible()
})
