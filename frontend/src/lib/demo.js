// Demo build (VITE_DEMO=1) — what runs on the GitHub Pages deployment.
//
// openGym is a purely static app: everything lives in the browser's localStorage, there is
// no server and no login. A demo build just boots with a seeded example history
// (demoSeed.js) so the charts, heatmap, streaks and "last time you lifted…" pre-fills have
// something to show instead of an empty shell.
//
// Only these two constants are shared with normal builds: Vite replaces VITE_DEMO at build
// time, so the demo-only UI folds away and the seed generator — imported dynamically — never
// lands in a normal bundle.
export const DEMO = import.meta.env.VITE_DEMO === '1'
export const DEMO_SEEDED = 'gym_demo_seeded_v1'
// The source of the build you are actually running — which, for a fork, is the fork. Upstream
// keeps its attribution in NOTICE.md, the README's fork note and the printed plan's footer.
export const REPO = 'https://github.com/soymatta/personal-opengym'
