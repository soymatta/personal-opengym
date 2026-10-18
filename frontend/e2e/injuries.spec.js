import { test, expect } from '@playwright/test'

// Two entries in one session, chosen for what they prove: a squat loads the knee, a standing calf
// raise does not (that is the ankle), so the same injured joint has to switch the warning on for
// the first and leave the second alone.
const seed = injuries => ({
  unit: 'kg', lang: 'en', langInstr: 'en', restSec: 0,
  routines: [], week: {}, dayPlan: {}, customEx: [], workouts: [], bodyweight: [],
  injuries,
  active: {
    id: 'a1', d: '2026-10-01', start: Date.parse('2026-10-01T10:00:00Z'),
    routineId: null, name: 'Freestyle', bw: null, cur: 0,
    entries: [
      { id: '0043', target: { id: '0043', sets: 1, reps: 8, weight: 60 }, sets: [{ w: 60, r: 8, done: false }] },
      { id: '0605', target: { id: '0605', sets: 1, reps: 12, weight: 40 }, sets: [{ w: 40, r: 12, done: false }] },
    ],
  },
})

const load = (page, injuries) => page.addInitScript(
  s => { try { localStorage.setItem('gym_state_v1', JSON.stringify(s)) } catch { /* */ } },
  seed(injuries)
)

const state = page => page.evaluate(() => JSON.parse(localStorage.getItem('gym_state_v1')))

test('the session warns about an injured joint it loads, and spares one it does not', async ({ page }) => {
  await load(page, ['knee'])
  await page.goto('/#/workout')

  const warn = page.locator('.progline.warn')
  await expect(warn).toHaveCount(1)
  await expect(warn).toContainText('loads an injured joint')
  await expect(warn).toContainText('knee')
  // It advises, it does not block: the set rows are still there to be filled in.
  await expect(page.locator('.setrow').first()).toBeVisible()

  await page.getByRole('button', { name: 'Next' }).click()
  await expect(warn).toHaveCount(0)
})

test('marking a joint in Settings brings the warning into the session, and clearing it takes it away', async ({ page }) => {
  await load(page, [])
  await page.goto('/#/settings')

  const chip = page.getByRole('button', { name: 'knee', exact: true })
  await expect(chip).toHaveAttribute('aria-pressed', 'false')

  await chip.click()
  await expect(chip).toHaveAttribute('aria-pressed', 'true')
  expect((await state(page)).injuries).toEqual(['knee'])

  await page.goto('/#/workout')
  await expect(page.locator('.progline.warn')).toContainText('knee')

  await page.goto('/#/settings')
  await page.getByRole('button', { name: 'knee', exact: true }).click()
  expect((await state(page)).injuries).toEqual([])

  await page.goto('/#/workout')
  await expect(page.locator('.progline.warn')).toHaveCount(0)
})
