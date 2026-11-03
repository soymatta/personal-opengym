import { test, expect } from '@playwright/test'

// A session already in progress, so the spec does not depend on which weekday it runs on
// (loading a plan schedules Mon/Wed/Fri, and a Tuesday run would open the day picker instead).
const seed = (restSec, rir) => ({
  unit: 'kg', lang: 'en', restSec,
  routines: [], week: {}, dayPlan: {}, customEx: [], workouts: [], bodyweight: [],
  active: {
    id: 'a1', d: '2026-10-01', start: Date.parse('2026-10-01T10:00:00Z'),
    routineId: null, name: 'Freestyle', bw: null, cur: 0,
    entries: [{
      id: '0025', target: { id: '0025', sets: 2, reps: 8, weight: 60 },
      ...(rir != null ? { rir } : {}),
      sets: [{ w: 60, r: 8, done: false }, { w: 60, r: 8, done: false }],
    }],
  },
})

const load = (page, restSec, rir) => page.addInitScript(
  s => { try { localStorage.setItem('gym_state_v1', JSON.stringify(s)) } catch { /* */ } },
  seed(restSec, rir)
)

test('checking a set starts the rest countdown', async ({ page }) => {
  await load(page, 90)
  await page.goto('/#/workout')
  await page.locator('.setrow').first().getByRole('checkbox').click()
  await expect(page.locator('#timer')).toBeVisible()
})

test('"No rest" logs the set but never starts a countdown', async ({ page }) => {
  await load(page, 0)
  await page.goto('/#/workout')
  await page.locator('.setrow').first().getByRole('checkbox').click()

  // Nothing to count down…
  await expect(page.locator('#timer')).toHaveCount(0)
  await expect(page.locator('body')).not.toHaveClass(/resting/)

  // …and the set is still logged: "no rest" is not "no recording".
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('gym_state_v1')))
  expect(stored.active.entries[0].sets[0].done).toBe(true)
})

test('a routine\'s effort target is shown once for the session', async ({ page }) => {
  await load(page, 90, 2)
  await page.goto('/#/workout')
  const line = page.locator('.progline', { hasText: 'Leave about 2 in reserve this session.' })
  await expect(line).toBeVisible()
  // One number for the whole workout: repeating it per exercise would turn it into wallpaper.
  await expect(line).toHaveCount(1)
})

test('a session with no target says nothing about effort', async ({ page }) => {
  await load(page, 90)
  await page.goto('/#/workout')
  await expect(page.getByText(/in reserve this session/)).toHaveCount(0)
})

test('RIR 0 becomes an instruction, not "leave 0 in reserve"', async ({ page }) => {
  await load(page, 90, 0)
  await page.goto('/#/workout')
  await expect(page.locator('.progline', { hasText: 'goes to failure this session' })).toBeVisible()
  await expect(page.getByText(/Leave about 0 in reserve/)).toHaveCount(0)
})
