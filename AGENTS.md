# AGENTS.md

Project conventions for AI agents working in this repo. Read this first.

## Committing — do not commit unless explicitly ordered

**Never run `git commit`, `git add` + commit, `git push`, or open a PR on your own
initiative.** Make all the file changes, run the checks, and report — then stop. Wait for the
user to explicitly say to commit ("commit", "commit this", "push it", "make a commit").

Committing when you were not told to is the single most disruptive thing you can do here.

When you *are* asked to commit, follow this order:

1. **Run the full QA suite and make it pass.** No commit over a red suite.
   ```bash
   cd frontend && npm run qa      # locales → vitest → build → playwright
   ```
   If `npm run qa` cannot run (deps missing), say so explicitly rather than committing anyway;
   at minimum `npm test` and `npm run build` must pass.
2. **Verify CI/CD still matches reality.** CI lives in `.github/workflows/` (`test.yml`,
   `pages.yml`). Confirm the workflow(s) you expect still reference files that exist and steps
   that still apply — a workflow pointing at a deleted directory or a removed script is a
   broken build waiting to happen.
3. **Inspect what you are about to commit**: `git status`, `git diff`, `git log --oneline -10`.
   Stage only intended files; never commit `.env`, secrets, or `node_modules`.
4. **Commit**, following the house message style: a capitalized conventional type plus a short
   English explanation, `{Type}: {explanation}` (e.g. `Refactor: make openGym a local-first PWA`).
5. **Push** (and open a PR) only if the user asked for it.

## What this project is

openGym as a **PWA-only, AI-free, local-first** app. There is **no backend, no server, no
Docker, and no login gate**. Everything the user owns lives in the browser's localStorage.

- **Never reintroduce** an API server, Docker/Compose, a native (Capacitor) shell, passkey
  auth, push notifications, or any AI/coach feature unless a human explicitly asks.
- **Local-first.** The whole training state is one JSON document in localStorage
  (`gym_state_v1`). Supabase is an *optional* cloud mirror, enabled only when
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are set (`frontend/.env.example`).
- **AI-friendly, not AI-powered.** The app ships no model. It exports data (JSON + NDJSON) that
  a user can paste into any AI. Keep that export round-trippable.
- **No media in the repo.** Exercise images/GIFs are ~140 MB and stay on the pinned jsDelivr
  CDN; `media/` is gitignored. A build can serve its own copy via `VITE_IMG_BASE` /
  `VITE_GIF_BASE` (see the comment in `src/lib/exercises.js`).

## Commands

Everything runs from **`frontend/`** — the repo root has no `package.json` and no workspace
tooling, so `npm test` at the root just fails.

```bash
cd frontend
npm ci
npm run dev          # vite
npm run build        # → frontend/dist (base './')
npm run preview      # serve dist/ locally
npm test             # vitest run, src/**/*.test.{js,jsx}
npm run locales      # check-locales.mjs — fast gate for any UI-text change
npm run e2e          # build, then playwright against dist/
npm run qa           # locales → test → e2e; the gate that matters
```

- One unit test: `npx vitest run src/lib/plates.test.js`, add `-t "nearest weight"` for a single
  case. Vitest 4 has no `basic` reporter; use `--reporter=verbose --silent=false` when you need
  `console.log` output.
- One e2e test: `npm run build && npx playwright test e2e/routine.spec.js -g "swap"`. The build
  is not optional (see below). `npx playwright test --list e2e/routine.spec.js` lists test names
  without building or launching anything.
- **There is no linter, formatter or typechecker configured.** Don't go looking for one —
  `npm run qa` is the gate.
- CI only fires on `frontend/**` and on `.github/workflows/` itself, so a root-only edit
  (docs, `scripts/`) ships without a test run.

## Layout

```
frontend/                 React 19 + Vite PWA (the whole app)
  src/lib/                pure logic (progression, 1RM, percentage waves, plate math,
                          measurements, history, import/export, replacements) + tests beside it
  src/store/              Zustand: useStore = persisted data, useUI = ephemeral UI
  src/views/              routed screens (Home, Plan, Workout, Stats, History, Library, Settings)
  src/components/         shared UI (ui.jsx primitives, charts, media, body map, icons)
  src/sheets.jsx          every modal sheet + the helpers that open them
  src/locales/            de es fr hi it pt zh — English is the key, it has no file
  src/names/es.js         hand-written Spanish exercise names (+ es.test.js)
  src/instr/              generated per-language instruction packs (English lives inline)
  public/sw.js            service-worker runtime cache
  e2e/                    Playwright specs
  scripts/check-locales.mjs
scripts/build-instructions.mjs   regenerates src/instr/ from the upstream dataset
supabase/schema.sql       table for optional cloud sync
docs/SUPABASE_VERCEL.md   optional multi-device setup
```

**Generated data, never hand-edited:** `src/lib/exercises-data.js` and `src/instr/*.js` (one pack
per language, 6 of the 8 — `de` and `pt` have no upstream instructions and fall back to
English). Regenerate with `node scripts/build-instructions.mjs` from the repo root.

Two Vercel configs exist on purpose, and editing the wrong one does nothing: `frontend/vercel.json`
(README's setup — project Root Directory `frontend`) and the root `vercel.json` (builds from the
repo root). `pages.yml` deploys the demo with `VITE_DEMO=1`, which seeds an example profile on
first load (`src/lib/demoSeed.js`).

## Conventions

- **Every string ships in every language.** The app speaks 8 languages and a user can switch
  at any moment, so English text reaching a translated UI is a bug, not a gap. When you add or
  change UI text — a label, a button, a toast, an option, a placeholder, a plan or routine name:
  1. English first (the source string is the key, `t('…')`, `{0}` placeholders).
  2. Then all 7 locale files in `frontend/src/locales/` (`de es fr hi it pt zh`), in the
     same commit. Append a new key with the same text in each file, next to the section it
     belongs to.
  3. Verify with `npm run locales` (also part of `npm run qa`). It fails on a key missing from any
     locale AND on any `t('…')` literal no locale carries, so a string you forgot cannot pass.
     `check-locales.mjs --json` prints the exact missing keys; `--stale` lists keys nobody asks
     for by literal — **that is not a delete list** (computed keys land there too).
  4. Match the existing vocabulary, don't invent a parallel one (`Rest` is `Pause` in German, a
     routine is a `训练日` in Chinese, `Rotina` in Portuguese — never a literal translation of the
     English word).
  5. **Data is text too.** Exercise body parts, equipment, targets, muscles, plan notes, routine
     names and weekdays all reach `t()` through a variable (`t(ex.eq)`, `t(plan.note)`), invisible
     to the literal scan. Renaming or adding one keeps `npm run locales` green while the UI drops
     to English — `src/lib/i18n-data.test.js` (inside `npm test`) is the gate for those.
- **Exercise names are data, not UI strings.** The dataset ships English `name`s only, so
  `frontend/src/names/es.js` holds the hand-written Spanish ones, each line carrying the
  dataset's English name in a comment that `frontend/src/names/es.test.js` checks character for
  character — an id pointing at the wrong exercise therefore fails the suite instead of showing
  the wrong movement. **The list is complete** (all 1,324 dataset exercises). What keeps it
  complete is the same rule as before, one line at a time: a new exercise (or a name that changes
  upstream) is translated by hand in the same commit, next to the section it belongs to. Never
  machine-translate in bulk to "finish" it — a name nobody read ships into every workout of that
  language. Spanish is the only language with such a file, and that is deliberate. Names render
  through `exName()` in `src/lib/exercises.js`, never `ex.n` directly, and in sentence case — the
  `capitalize` class would turn a Spanish name into `Press De Banca Con Barra`.
- **State goes through the store, never straight to localStorage.** `useStore` holds the whole
  document as `S`; mutate it with `useStore.getState().update(draft => { … })`, which clones,
  persists under `gym_state_v1` and schedules the debounced Supabase push. Add every new persisted
  field to `DEF` in `src/store/useStore.js` — loaded state is overlaid on it, so a missing default
  is a field that vanishes on reload. Sheets, toast and timers live in `useUI` and are never
  persisted.
- **Sheets are a stack, not routes.** Open one with the exported helper
  (`exerciseDetailSheet(ex)`, `exConfigSheet(...)`) or `useUI.openSheet(render)`; it returns
  `{ close, lock }` and `close()` pops only that sheet. Opening a sheet from inside a sheet (e.g.
  the replacement picker over the exercise config) leaves the parent underneath on purpose.
- **Tests live next to the code** they cover (`*.test.js` in `src/lib/`) and are the primary
  gate. E2E specs live in `frontend/e2e/`.
- **Pure functions first.** Keep training math in `src/lib/` as pure, testable functions —
  not inside components. `src/lib/` has zero import cycles and no duplicate exports; keep it that
  way.
- **Service worker:** `public/sw.js` keeps a runtime cache (`opengym-rt-v1`, `opengym-media-v1`)
  and `activate` only deletes caches not in `KEEP`. If you change *what* it caches under the same
  name, existing installs keep serving the old entries — bump the cache constant.
- **Windows/PowerShell note for agents**: this checkout may live on an exFAT/Ventoy volume. If
  `git status` shows hundreds of bogus mode changes, run `git config core.fileMode false`.

## Verification before claiming done

Point to a concrete passing gate — `npm test`, `npm run build`, `npm run locales`, `npm run qa` —
that you actually ran. Don't commit or report success on "should work".

The Playwright specs run against the built bundle in `frontend/dist/`, not against the source, so
`npm run e2e` builds first before starting `vite preview` on port 4173 (`--strictPort`). Do not
call `npx playwright test` directly after editing `src/`: it will happily test the previous build
and report on code that no longer exists. Locally Playwright reuses a server already listening on
4173 (`reuseExistingServer`), so a stray `vite preview` left running can make a failing run look
odd — kill it before debugging.
