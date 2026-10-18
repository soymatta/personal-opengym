import { describe, it, expect } from 'vitest'
import { JOINTS, jointsTouched, riskFor } from './injuries.js'

// Real ids from the shipped dataset, picked so each case is a different way of being right:
// a squat (quadriceps + hamstrings), a leg press, a leg curl (hamstrings alone), and three
// movements that must stay quiet for a knee — a calf raise (ankle), a bench press and a row.
const SQUAT = '0043'          // barbell full squat
const LEG_PRESS = '0739'      // sled 45° leg press
const LEG_CURL = '0586'       // lever lying leg curl
const CALF_RAISE = '0605'     // lever standing calf raise
const BENCH = '0025'          // barbell bench press
const ROW = '0027'            // barbell bent over row
const DEADLIFT = '0085'       // barbell romanian deadlift

describe('injuries', () => {
  it('knows a squat loads the knee', () => {
    expect(jointsTouched(SQUAT)).toContain('knee')
  })

  it('keeps a knee injury quiet through a calf raise, a bench press and a row', () => {
    // The whole value of the feature is in this line: a warning that fires on everything is a
    // warning nobody reads.
    expect(jointsTouched(CALF_RAISE)).not.toContain('knee')
    expect(riskFor(CALF_RAISE, ['knee'])).toEqual([])
    expect(riskFor(BENCH, ['knee'])).toEqual([])
    expect(riskFor(ROW, ['knee'])).toEqual([])
  })

  it('warns about an injured knee for the movements that load it', () => {
    for (const id of [SQUAT, LEG_PRESS, LEG_CURL]) {
      expect(riskFor(id, ['knee']).map(r => r.joint)).toEqual(['knee'])
    }
  })

  it('says which muscle made it a match, not just that it matched', () => {
    // A leg curl has no quadriceps in its data, so a "why" that lists them would be invented.
    expect(riskFor(LEG_CURL, ['knee'])[0].why).toEqual(['hamstrings'])
    expect(riskFor(SQUAT, ['knee'])[0].why).toContain('quadriceps')
  })

  it('reports every injured joint a movement pulls on, once each', () => {
    const hits = riskFor(DEADLIFT, ['knee', 'hip', 'lower back', 'elbow']).map(r => r.joint)
    expect(hits).toContain('hip')
    expect(hits).toContain('lower back')
    expect(hits).not.toContain('elbow')
    expect(new Set(hits).size).toBe(hits.length)
  })

  it('stays silent when nothing is injured', () => {
    expect(riskFor(SQUAT, [])).toEqual([])
    expect(riskFor(SQUAT, undefined)).toEqual([])
    expect(riskFor(SQUAT, null)).toEqual([])
  })

  it('ignores an injury the app does not know about', () => {
    expect(riskFor(SQUAT, ['spleen'])).toEqual([])
  })

  it('warns about a custom exercise from its name alone', () => {
    // Custom exercises carry an id, a name and a body part and nothing else — no muscles to read,
    // so the name is the only thing that can catch them, and it has to.
    expect(riskFor({ id: 'mine-1', n: 'Barbell Front Squat', bp: 'upper legs' }, ['knee'])).toHaveLength(1)
    expect(riskFor({ id: 'mine-2', n: 'Bicep Curl Machine', bp: 'upper arms' }, ['knee'])).toEqual([])
  })

  it('answers for an unknown id without throwing', () => {
    expect(jointsTouched('nope')).toEqual([])
    expect(riskFor('nope', ['knee'])).toEqual([])
  })

  it('watches a fixed set of joints', () => {
    expect(JOINTS).toEqual(['knee', 'hip', 'lower back', 'shoulder', 'elbow', 'wrist', 'ankle', 'neck'])
    expect(new Set(JOINTS).size).toBe(JOINTS.length)
  })
})
