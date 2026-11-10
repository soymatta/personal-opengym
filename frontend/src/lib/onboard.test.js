import { describe, it, expect } from 'vitest'
import { recommendPlan, recommendedPlan } from './onboard.js'
import { planOf } from './plans.js'

describe('recommendPlan', () => {
  it('recommends the 5-day split from five days up', () => {
    expect(recommendPlan({ days: 5 }).key).toBe('pplul')
    expect(recommendPlan({ days: 6 }).key).toBe('pplul')
    expect(recommendPlan({ days: 7 }).key).toBe('pplul')
  })

  it('recommends upper/lower on exactly four days', () => {
    expect(recommendPlan({ days: 4 }).key).toBe('upperlower')
  })

  it('splits three days by goal and experience', () => {
    expect(recommendPlan({ days: 3, goal: 'strength' }).key).toBe('strong5x5')
    expect(recommendPlan({ days: 3, goal: 'hypertrophy', experience: 'beginner' }).key).toBe('fullbody')
    expect(recommendPlan({ days: 3, goal: 'lose', experience: 'advanced' }).key).toBe('ppl')
    expect(recommendPlan({ days: 3 }).key).toBe('ppl')
  })

  it('strength beats beginner on three days — the barbell program is the beginner strength plan', () => {
    expect(recommendPlan({ days: 3, goal: 'strength', experience: 'beginner' }).key).toBe('strong5x5')
  })

  it('falls back to full body on two days, one day, or no answer at all', () => {
    expect(recommendPlan({ days: 2 }).key).toBe('fullbody')
    expect(recommendPlan({ days: 1 }).key).toBe('fullbody')
    expect(recommendPlan({}).key).toBe('fullbody')
    expect(recommendPlan().key).toBe('fullbody')
  })

  it('always names a valid plan and carries a reason', () => {
    const cases = [
      { days: 7 }, { days: 5 }, { days: 4 }, { days: 3, goal: 'strength' },
      { days: 3, experience: 'beginner' }, { days: 3 }, { days: 2 }, {},
    ]
    for (const c of cases) {
      const { key, reasonKey } = recommendPlan(c)
      expect(planOf(key), JSON.stringify(c)).toBeDefined()
      expect(reasonKey.length).toBeGreaterThan(20)
    }
  })
})

describe('recommendedPlan', () => {
  it('returns the plan object, never undefined', () => {
    expect(recommendedPlan({ days: 5 }).key).toBe('pplul')
    expect(recommendedPlan({}).key).toBe('fullbody')
  })
})
