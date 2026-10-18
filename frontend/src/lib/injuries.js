// Injuries — which joints a movement loads, so the app can warn before you train through a
// niggle instead of after.
//
// The point is that this needs no hand-tagging of the dataset: every exercise already declares the
// muscles it targets (`tg`), the muscle group (`mg`) and the secondary muscles (`sm`), and a joint
// is what those muscles cross. Muscles are the honest signal, and the name is only a fallback for
// the few movements that load a joint without naming the muscle — plus for custom exercises a user
// typed in, which carry no muscle data at all.
//
// Deliberately not a body-part match: `upper legs` would flag every calf raise (ankle, not knee)
// the same way it flags a squat. The muscle lists below are why a knee injury hears about a leg
// press and not about a standing calf raise.
import { exOr } from './exercises.js'

// The joints the app watches, keyed by the string that goes through t() — 'lower back' is spelled
// to match the dataset's own muscle name, so the two vocabularies stay one vocabulary.
export const JOINTS = ['knee', 'hip', 'lower back', 'shoulder', 'elbow', 'wrist', 'ankle', 'neck']

// muscles: what the movement trains, and therefore what it pulls on. names: movements that load
// the joint without the muscle data saying so, kept short on purpose — a wide regex would flag
// exercises whose name merely mentions the word.
const SPEC = {
  knee: {
    muscles: ['quadriceps', 'quads', 'hamstrings', 'adductors'],
    names: /\b(squat|lunge|leg press|leg extension|leg curl|step-?up|pistol|sissy|bulgarian|thruster|clean|snatch|hack)\b/i,
  },
  hip: {
    muscles: ['glutes', 'hip flexors', 'adductors', 'abductors'],
    names: /\b(deadlift|hip thrust|glute bridge|good morning|swing|hip (?:abduction|adduction|extension|hinge))\b/i,
  },
  'lower back': {
    muscles: ['lower back', 'spine'],
    names: /\b(deadlift|good morning|back extension|hyperextension|bent over|t-?bar|superman)\b/i,
  },
  shoulder: {
    muscles: ['delts', 'deltoids', 'rotator cuff', 'serratus anterior', 'lats'],
    names: /\b(overhead press|military press|shoulder press|arnold|upright row|behind the neck|pull-?up|chin-?up|snatch|jerk|dip)\b/i,
  },
  elbow: {
    muscles: ['biceps', 'triceps', 'brachialis'],
    names: /\b(pushdown|skull ?crusher|preacher|close grip)\b/i,
  },
  wrist: {
    muscles: ['forearms', 'wrist flexors', 'wrist extensors', 'wrists', 'hands'],
    names: /\b(wrist|grip|farmer|hold|handstand)\b/i,
  },
  ankle: {
    muscles: ['calves', 'soleus', 'ankles', 'ankle stabilizers', 'feet'],
    names: /\b(calf|calves|jump|hop|skip|sprint|stair|heel raise)\b/i,
  },
  neck: {
    muscles: ['levator scapulae', 'traps', 'trapezius'],
    names: /\b(shrug|neck|trap)\b/i,
  },
}

// Same convention as isCardio(): an id is looked up, an object is taken as it comes. Callers hand
// over whichever they hold — the workout screen has the exercise, a routine row has only the id.
const asEx = idOrEx => (typeof idOrEx === 'string' ? exOr(idOrEx) : idOrEx)

/** Every joint a movement loads, in JOINTS order — the question "what does this pull on?" asked
 *  on its own, with no injuries involved. */
export function jointsTouched(idOrEx) {
  const ex = asEx(idOrEx)
  if (!ex) return []
  const muscles = [ex.tg, ex.mg, ...(ex.sm || [])].filter(Boolean)
  return JOINTS.filter(joint => {
    const spec = SPEC[joint]
    return muscles.some(m => spec.muscles.includes(m)) || spec.names.test(ex.n || '')
  })
}

/** What to warn about: the injured joints this movement loads, each with the muscles that made it
 *  a match, so the warning can say why instead of just asserting it.
 *  Empty for no injuries, an unknown exercise, or a movement that spares every one of them. */
export function riskFor(idOrEx, injuries) {
  if (!injuries || !injuries.length) return []
  const ex = asEx(idOrEx)
  if (!ex) return []
  const muscles = [ex.tg, ex.mg, ...(ex.sm || [])].filter(Boolean)
  return injuries
    .filter(joint => SPEC[joint])
    .map(joint => ({
      joint,
      why: [...new Set(muscles.filter(m => SPEC[joint].muscles.includes(m)))],
    }))
    .filter(hit => hit.why.length || SPEC[hit.joint].names.test(ex.n || ''))
}
