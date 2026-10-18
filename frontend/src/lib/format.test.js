import { describe, it, expect, afterAll } from 'vitest'
import { fmtDur } from './format.js'
import { setLang } from './i18n.js'

// A duration is UI text, unit included: `fmtDur` used to build "1h 30m" out of hardcoded letters,
// so every language read English. The strings are keys now ({0}h {1}m / {0} min), and these tests
// pin both the shapes and the fact that they go through t() at all.
describe('fmtDur', () => {
  afterAll(() => setLang('en'))

  it('renders minutes below an hour', () => {
    expect(fmtDur(45 * 60000)).toBe('45 min')
    expect(fmtDur(59 * 60000)).toBe('59 min')
  })

  it('renders hours and minutes from an hour up', () => {
    expect(fmtDur(60 * 60000)).toBe('1h 0m')
    expect(fmtDur(90 * 60000)).toBe('1h 30m')
  })

  it('floors to whole minutes', () => {
    expect(fmtDur(90 * 60000 + 59000)).toBe('1h 30m')
  })

  it('translates the unit, not just the number', async () => {
    await setLang('de')
    expect(fmtDur(45 * 60000)).toBe('45 Min.')
    expect(fmtDur(90 * 60000)).toBe('1 Std. 30 Min.')
  })
})
