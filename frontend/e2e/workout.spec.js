import { test, expect } from '@playwright/test'

// A session already in progress, so the spec does not depend on which weekday it runs on
// (loading a plan schedules Mon/Wed/Fri, and a Tuesday run would open the day picker instead).
const seed = restSec => ({
  unit: 'kg', lang: 'en', restSec,
  routines: [], week: {}, dayPlan: {}, customEx: [], workouts: [], bodyweight: [],
  active: {
    id: 'a1', d: '2026-10-01', start: Date.parse('2026-10-01T10:00:00Z'),
    routineId: null, name: 'Freestyle', bw: null, cur: 0,
    entries: [{
      id: '0025', target: { id: '0025', sets: 2, reps: 8, weight: 60 },
      sets: [{ w: 60, r: 8, done: false }, { w: 60, r: 8, done: false }],
    }],
  },
})

const load = (page, restSec) => page.addInitScript(
  s => { try { localStorage.setItem('gym_state_v1', JSON.stringify(s)) } catch { /* */ } },
  seed(restSec)
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
