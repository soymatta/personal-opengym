// Onboarding recommender: which ready-made plan fits the survey answers.
//
// A pure function over days/goal/experience, so the mapping is asserted in a test instead of
// clicked through. The reason is the sentence the recommendation card shows — short, honest,
// and naming the mechanism (frequency), not superlatives.
import { planOf } from './plans.js'

/**
 * Pick a plan for the survey answers.
 * @param {{days?: number|null, goal?: string|null, experience?: string|null}} answers
 * @returns {{key: string, reasonKey: string}} a PLAN_LIBRARY key (always valid) + the EN reason
 */
export function recommendPlan({ days, goal, experience } = {}) {
  const d = Number(days) || 0
  if (d >= 5) return { key: 'pplul', reasonKey: 'Five days means every muscle twice a week — the most training the shelf knows how to schedule.' }
  if (d === 4) return { key: 'upperlower', reasonKey: 'Four days fits an upper/lower split — every muscle twice a week in sessions of about an hour.' }
  if (d === 3) {
    if (goal === 'strength') return { key: 'strong5x5', reasonKey: 'Three days and a strength goal means barbell basics — squat every session and add weight each time.' }
    if (experience === 'beginner') return { key: 'fullbody', reasonKey: 'Trains every muscle three times a week — the most forgiving start.' }
    return { key: 'ppl', reasonKey: 'Three days with longer sessions — one movement pattern per day with room to push each one.' }
  }
  return { key: 'fullbody', reasonKey: 'Trains every muscle three times a week — the most forgiving start.' }
}

/** The plan object behind a recommendation — never undefined, even for stale answers. */
export function recommendedPlan(answers) {
  return planOf(recommendPlan(answers).key) || planOf('fullbody')
}
