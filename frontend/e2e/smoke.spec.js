import { test, expect } from '@playwright/test'

// Every spec starts from an empty install — the app is local-first, so a clean localStorage
// is a clean app.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.clear() } catch { /* */ } })
})

test('boots straight into Home with the week strip and tab bar', async ({ page }) => {
  await page.goto('/#/home')
  await expect(page.getByRole('heading', { name: 'Personal Open Gym' })).toBeVisible()
  await expect(page.locator('.week .wday').first()).toBeVisible()
  await expect(page.locator('#tabbar')).toBeVisible()
})

test('the app name fits the header even on a 320px phone', async ({ page }) => {
  // The brand is the longest title in the app and its own row is shared with the gear button.
  // It shrinks rather than wraps — a name broken over two lines stops reading as a name — so the
  // narrowest phone in use is where that promise has to hold. Measured, not eyeballed.
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/#/home')

  const h = page.locator('.hdr h1.brand')
  const box = await h.boundingBox()
  const gear = await page.locator('.hdr .iconbtn').first().boundingBox()
  const fontPx = await h.evaluate(el => parseFloat(getComputedStyle(el).fontSize))

  expect(box.height, 'one line').toBeLessThan(fontPx * 1.6)
  expect(gear.x - (box.x + box.width), 'clears the gear').toBeGreaterThan(0)
  const doc = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth])
  expect(doc[0], 'no sideways scroll').toBeLessThanOrEqual(doc[1])
})

test('tabs move between the main screens', async ({ page }) => {
  await page.goto('/#/home')
  const tabs = page.locator('#tabbar')

  await tabs.getByRole('button', { name: 'Plan' }).click()
  // Exact: the screen heading is "Plan", but the ready-made shelf heading ("Pre-made plans")
  // also contains the word, and a substring match is a strict-mode violation.
  await expect(page.getByRole('heading', { name: 'Plan', exact: true })).toBeVisible()

  await tabs.getByRole('button', { name: 'Stats' }).click()
  await expect(page).toHaveURL(/#\/stats/)

  await tabs.getByRole('button', { name: 'Exercises' }).click()
  await expect(page).toHaveURL(/#\/library/)

  await tabs.getByRole('button', { name: 'Home' }).click()
  await expect(page).toHaveURL(/#\/home/)
})

test('Settings opens from Home and never asks for a login', async ({ page }) => {
  await page.goto('/#/home')
  await page.getByRole('button', { name: 'Settings' }).click()
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
  // The account section says there is no account, and no sign-in/passkey control exists.
  await expect(page.getByText('No account needed')).toBeVisible()
  await expect(page.getByRole('button', { name: /passkey/i })).toHaveCount(0)
})

test('a fresh install can load the starter plan', async ({ page }) => {
  await page.goto('/#/home')
  await expect(page.getByText('Welcome!')).toBeVisible()

  await page.getByRole('button', { name: /Load starter plan/ }).click()

  // The empty-state card is replaced by a scheduled week (Mon/Wed/Fri in the starter plan).
  await expect(page.getByText('Welcome!')).toBeHidden()
  expect(await page.locator('.week .dot.plan').count()).toBeGreaterThan(0)

  // …and it persisted: three routines, three scheduled days.
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('gym_state_v1')))
  expect(stored.routines).toHaveLength(3)
  expect(Object.values(stored.week).filter(Boolean)).toHaveLength(3)

  await page.locator('#tabbar').getByRole('button', { name: 'Plan' }).click()
  await expect(page.getByRole('heading', { name: 'Plan', exact: true })).toBeVisible()
})

test('the ready-made shelf loads a plan and fills the week', async ({ page }) => {
  await page.goto('/#/plan')
  await expect(page.getByRole('heading', { name: 'Pre-made plans' })).toBeVisible()

  // Deliberately not the starter plan: the shelf itself is what is under test.
  await page.getByText('Full Body · 3 days').click()

  // The same routine name shows up twice by design — once in the week rows (Mon and Fri) and
  // once in the routines list — so a substring match would be a strict-mode violation.
  await expect(page.getByText('Full Body A').first()).toBeVisible()
  await expect(page.getByText('Full Body B').first()).toBeVisible()

  // …and it persisted as a Mon/Wed/Fri week alternating A and B.
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('gym_state_v1')))
  expect(stored.routines.map(r => r.name)).toEqual(['Full Body A', 'Full Body B'])
  expect(Object.keys(stored.week).sort()).toEqual(['1', '3', '5'])
  expect(stored.week['1']).toBe(stored.week['5'])
  expect(stored.week['3']).not.toBe(stored.week['1'])
})

test('loading a second plan asks first, because it replaces the week', async ({ page }) => {
  await page.goto('/#/plan')
  await page.getByText('Full Body · 3 days').click()
  await expect(page.getByText('Full Body A').first()).toBeVisible()

  // A plan loaded on a non-empty app must confirm — the message says what survives.
  await page.getByText('Push / Pull / Legs').click()
  await expect(page.getByText(/replaces your current weekly schedule/)).toBeVisible()
  await page.getByRole('button', { name: 'Load' }).click()

  await expect(page.getByText('Push Day').first()).toBeVisible()
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('gym_state_v1')))
  // Routines are added, never wiped: the four before + the three PPL days.
  expect(stored.routines.map(r => r.name)).toEqual(['Full Body A', 'Full Body B', 'Push Day', 'Pull Day', 'Leg Day'])
  expect(Object.values(stored.week).filter(Boolean)).toHaveLength(3)
})

test('the rest timer can be switched off entirely', async ({ page }) => {
  await page.goto('/#/settings')
  await page.getByText('Rest timer').click()
  await page.getByRole('button', { name: 'No rest' }).click()

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('gym_state_v1')))
  expect(stored.restSec).toBe(0)
})
