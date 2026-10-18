// Plate calculator — what to hang on each side of the bar for a target weight.
//
// Pure and unit-aware. The greedy pass is exact for a canonical plate set (each denomination
// divides the next by at least two, e.g. 25 > 20 > 15 > 10 > 5 > 2.5 > 1.25), so the answer can
// be trusted without a search — and it is the order you would actually load: biggest first.
//
// Weights nobody can load exactly are reported honestly instead of being rounded away: the
// caller gets both what the bar will actually carry (`loaded`) and what is left over
// (`remainder`), so the app can say "22.5 kg on the bar, 1 kg short" rather than pretending.

// Per-side plate sets a normal gym stocks. Bar weight per unit follows the plates sold for it
// (20 kg / 45 lb), which is also what the slides in Settings assume.
export const KG_BAR = 20
export const LB_BAR = 45
export const KG_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25]
export const LB_PLATES = [45, 35, 25, 10, 5, 2.5]

export const barOf = unit => (unit === 'lb' ? LB_BAR : KG_BAR)
export const platesOf = unit => (unit === 'lb' ? LB_PLATES : KG_PLATES)

// Bar choices worth offering (a 15 kg women's bar, a 10 kg technique bar, a 35 lb bar) —
// "why can't I load 40 kg" is usually a different bar, not a missing plate.
export const BARS = { kg: [20, 15, 10], lb: [45, 35, 25] }

const round2 = v => Math.round(v * 100) / 100

/**
 * Split `target` across the two sides of the bar.
 *
 * @param {number} target  total weight to load (bar included)
 * @param {object} [opts]  { unit, bar, plates } — overrides for a different bar or plate set
 * @returns {{ unit, bar, perSide: {p:number,n:number}[], loaded:number, remainder:number, below:boolean }}
 *   `perSide` is biggest-first; `loaded` is what the bar actually weighs; `remainder` is
 *   `target - loaded` (never negative — the greedy pass stops before overshooting) and
 *   `below` marks a target lighter than the bare bar, where no plates apply.
 */
export function loadFor(target, opts = {}) {
  const unit = opts.unit === 'lb' ? 'lb' : 'kg'
  const bar = opts.bar > 0 ? opts.bar : barOf(unit)
  const plates = (opts.plates && opts.plates.length ? opts.plates : platesOf(unit))
    .slice().sort((a, b) => b - a)
  const want = Number(target) || 0

  if (want <= bar) {
    return { unit, bar, perSide: [], loaded: bar, remainder: round2(want - bar), below: want < bar }
  }

  // Each plate is 2× on the bar, so the side carries half of what is above the bar.
  let perSideWeight = (want - bar) / 2
  const perSide = []
  for (const p of plates) {
    let n = 0
    while (perSideWeight >= p - 1e-9 && n < 20) { perSideWeight -= p; n++ }
    if (n) perSide.push({ p, n })
  }

  const loaded = round2(bar + 2 * perSide.reduce((s, x) => s + x.p * x.n, 0))
  return { unit, bar, perSide, loaded, remainder: round2(want - loaded), below: false }
}

/** Flat list of plates for one side, smallest-last order kept from loadFor. */
export const flatLoad = load => load.perSide.flatMap(x => Array.from({ length: x.n }, () => x.p))

/**
 * The heaviest weight the bar can hold at or under `target`. Rounding down is the only safe
 * direction: you can add the missing kilo, you cannot un-load a plate mid-set.
 */
export const nearestUnder = (target, opts) => loadFor(target, opts).loaded
