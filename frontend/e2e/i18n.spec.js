import { test, expect } from '@playwright/test'

// The rule this file enforces: a string added to the app must exist in every language, and a
// user who switches language must actually SEE it. check-locales.mjs proves every locale
// carries every key; only a rendered screen proves the key reaches the UI.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.clear() } catch { /* */ } })
})

// The row's own label is translated too, so a second switch needs the label of the language
// you are currently in — that is the whole point of the screen being translated.
const pickLanguage = async (page, name, rowLabel = 'Language') => {
  await page.getByText(rowLabel, { exact: true }).click()
  await page.getByRole('button', { name }).click()
}

test('switching language translates the ready-made shelf', async ({ page }) => {
  await page.goto('/#/plan')
  await expect(page.getByRole('heading', { name: 'Pre-made plans' })).toBeVisible()

  await page.goto('/#/settings')
  await pickLanguage(page, 'Español')

  await page.goto('/#/plan')
  await expect(page.getByRole('heading', { name: 'Planes predefinidos' })).toBeVisible()
  await expect(page.getByText('Cuerpo completo · 3 días')).toBeVisible()
  await expect(page.getByText('Cargar', { exact: true }).first()).toBeVisible()
  // The English source strings must be gone, not merely accompanied.
  await expect(page.getByText('Pre-made plans')).toHaveCount(0)
})

test('switching language translates the rest-timer choices', async ({ page }) => {
  await page.goto('/#/settings')
  await pickLanguage(page, 'Español')

  await page.getByText('Temporizador de descanso').click()
  await page.getByRole('button', { name: 'Sin descanso' }).click()

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('gym_state_v1')))
  expect(stored.restSec).toBe(0)
})

test('exercise names follow the language, and both languages stay searchable', async ({ page }) => {
  // Names come from the dataset, not from the locale files, so nothing in check-locales.mjs can
  // catch them: only a screen can. Spanish is covered exercise by exercise, the rest of the
  // languages fall back to the English name.
  await page.goto('/#/library')
  const search = page.getByPlaceholder('Search…')

  await search.fill('barbell bench press')
  await expect(page.getByText('Barbell bench press')).toBeVisible()

  await page.goto('/#/settings')
  await pickLanguage(page, 'Español')
  await page.goto('/#/library')

  const es = page.getByPlaceholder('Buscar…')
  await es.fill('barbell bench press')
  // Typed in English while reading Spanish: still found, shown in Spanish. Exact, because the
  // dataset ships point-of-view twins and a substring match would land on all of them at once
  // ("Sentadilla completa con barra" is a prefix of both "(vista trasera)" rows).
  await expect(page.getByText('Press de banca con barra', { exact: true })).toBeVisible()

  await es.fill('sentadilla completa')
  await expect(page.getByText('Sentadilla completa con barra', { exact: true })).toBeVisible()
  // The English name must not still be on the row a Spanish user is reading.
  await expect(page.getByText('barbell full squat')).toHaveCount(0)
})

test('German and Chinese use their own vocabulary for routine, plan and rest', async ({ page }) => {
  // The traps a key-set comparison cannot see: in German rest is a Pause, never a Ruhe, and in
  // Chinese a routine is a 训练日 ("training day"), not a literal translation of the English word.
  // A literal translation reads wrong even though every key is present.
  await page.goto('/#/settings')
  await pickLanguage(page, 'Deutsch')
  await page.getByText('Pausen-Timer').click()
  await expect(page.getByRole('button', { name: 'Keine Pause' })).toBeVisible()
  await page.getByRole('button', { name: 'Keine Pause' }).click()

  await page.goto('/#/plan')
  await expect(page.getByRole('heading', { name: 'Fertige Pläne' })).toBeVisible()
  await expect(page.getByText('Routinen', { exact: true })).toBeVisible()

  await page.goto('/#/settings')
  await pickLanguage(page, '中文', 'Sprache')
  await page.goto('/#/plan')
  await expect(page.getByRole('heading', { name: '现成计划' })).toBeVisible()
  await expect(page.getByText('训练日', { exact: true })).toBeVisible()
})
