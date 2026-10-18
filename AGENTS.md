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
   cd frontend && npm run qa      # vitest → build → playwright e2e
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
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are set.
- **AI-friendly, not AI-powered.** The app ships no model. It exports data (JSON + NDJSON) that
  a user can paste into any AI. Keep that export round-trippable.

## Layout

```
frontend/                 React 19 + Vite PWA (the whole app)
  src/lib/                pure logic (progression, 1RM, history, export) + Vitest tests beside it
  src/store/              Zustand store (useStore = data, useUI = ephemeral UI)
  src/views/              routed screens (Home, Plan, Workout, Stats, History, Library, Settings)
  src/sheets.jsx          modal sheets (the app's "breakout" UI)
  public/sw.js            service-worker runtime cache
  e2e/                    Playwright specs
supabase/schema.sql       table for optional cloud sync
docs/SUPABASE_VERCEL.md   optional multi-device setup
```

## Conventions

- **Every string ships in every language.** The app speaks 12 languages and a user can switch
  at any moment, so English text reaching a translated UI is a bug, not a gap. When you add or
  change UI text — a label, a button, a toast, an option, a placeholder, a plan or routine name:
  1. English first (the source string is the key, `t('…')`).
  2. Then all 11 locales in `frontend/src/locales/` (`de es fr hi it ko pl pt ru tr zh`), in the
     same commit. Append a new key with the same text in each file, next to the section it
     belongs to.
  3. Verify with `npm run locales` (also part of `npm run qa`). It fails on a key missing from any
     locale AND on any `t('…')` literal no locale carries, so a string you forgot cannot pass.
     `ALLOW_ENGLISH_ONLY` in that script is the only escape hatch — keep it empty; every entry
     is text a non-English user will read in English.
  4. Match the existing vocabulary, don't invent a parallel one (`Routine` is `Программа` in
     Russian, `Plan treningowy` in Polish, `루틴` in Korean; `Rest` is `Pause` in German).
- **Exercise names are data, not UI strings.** The dataset ships English `name`s only, so
  `frontend/src/names/es.js` holds the hand-written Spanish ones, each line carrying the
  dataset's English name in a comment that `es.test.js` checks character for character — an id
  pointing at the wrong exercise therefore fails the suite instead of showing the wrong
  movement. **The list is complete** (all 1,324 dataset exercises). What keeps it complete is the
  same rule as before, one line at a time: a new exercise (or a name that changes upstream) is
  translated by hand in the same commit, next to the section it belongs to. Never machine-translate
  in bulk to "finish" it — a name nobody read ships into every workout of that language. Spanish is
  the only language with such a file, and that is deliberate. Names render through
  `exName()` in `src/lib/exercises.js`, never `ex.n` directly, and in sentence case — the
  `capitalize` class would turn a Spanish name into `Press De Banca Con Barra`.
- **Tests live next to the code** they cover (`*.test.js` in `src/lib/`) and are the primary
  gate. E2E specs live in `frontend/e2e/`.
- **Pure functions first.** Keep training math in `src/lib/` as pure, testable functions —
  not inside components.
- **Windows/PowerShell note for agents**: this checkout may live on an exFAT/Ventoy volume. If
  `git status` shows hundreds of bogus mode changes, run `git config core.fileMode false`.

## Verification before claiming done

Point to a concrete passing gate — `npm test`, `npm run build`, `npm run qa`, or
`check-locales.mjs` — that you actually ran. Don't commit or report success on "should work".

The Playwright specs run against the built bundle in `frontend/dist/`, not against the source, so
`npm run e2e` builds first before starting `vite preview`. Do not call `npx playwright test`
directly after editing `src/`: it will happily test the previous build and report on code that no
longer exists.
