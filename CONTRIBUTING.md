# Contributing to openGym

Thanks for taking a look! openGym is intentionally small and dependency-light, and the goal is
to keep it that way — easy to read, easy to host.

## Project layout

```
frontend/  React + Vite app (src/views, src/components, src/store, src/lib). Builds to static files.
           public/sw.js is the service worker; e2e/ holds the Playwright specs.
supabase/  schema.sql — the table used by the optional cloud sync.
docs/      optional multi-device (Supabase) setup.
media/     exercise img/gif (gitignored, served separately).
```

There is deliberately **no backend and no server** — the whole app is static files. Do not add
an API, a Docker setup, a native (Capacitor) shell, or a login gate.

## Running for development

```bash
cd frontend
npm install
npm run dev        # Vite dev server (no backend to start)
npm test           # unit tests for the training logic (Vitest)
npm run e2e        # end-to-end (Playwright) — needs `npm run build` first
npm run qa         # test → build → e2e, the gate CI runs
```

## Guidelines

- **Keep it dependency-light.** The frontend uses React + Router + Zustand (plus Supabase JS for
  the optional sync) and nothing else; new deps are a hard sell.
- **Match the style.** Small components, clear names, comments only where the "why" isn't obvious.
  State lives in the Zustand store (`src/store`); pure helpers in `src/lib`.
- **Never commit** the exercise media (`media/`) — it's gitignored.
- **Test the flow** you touched — click through the affected screens (and the workout flow) in a
  browser, add a Playwright spec if it's a user-facing path, before opening a PR.
- **Training logic gets a unit test.** Anything deciding what you lift next, or reading a logged
  session back, belongs in a pure helper in `src/lib` with tests beside it (`npm test`). These
  rules are easy to get subtly wrong and nearly impossible to verify by clicking — the
  progression engine grew two real bugs that only a test pinned down.
- **Keep locales in sync.** `node scripts/check-locales.mjs` must stay green.
- **Keep local-first.** New features must keep working with no network and no account; cloud
  sync (Supabase) is always optional on top.

## Good first issues

- Additional starter plans (upper/lower, full-body, 5×5…)
- More languages for the exercise instructions (the dataset ships several)
- Percentage / training-max programming (5/3/1-style) on top of the progression engine in
  `src/lib/progression.js` — the policy interface is already there
- Accessibility passes on the workout and chart screens
- More shapes for the AI-friendly export (e.g. a markdown summary)

## Where to ask what

| You have | Goes to |
| --- | --- |
| A question, or something that won't behave | [Issues](https://github.com/soymatta/personal-opengym/issues) — describe what you saw |
| An idea you're not sure about yet | [Issues](https://github.com/soymatta/personal-opengym/issues) — say it is an idea, and we'll talk it through there |
| A reproducible bug | [Issues](https://github.com/soymatta/personal-opengym/issues) |
| A change you've already built | A pull request |

> This is a personal fork, so its Issues is the tracker for *this* app. The upstream project's
> Discussions (questions, ideas, setups) are about the original app — the backend, the AI Coach
> and the login features that this fork does not have.

## Reporting bugs

Open an issue with: what you did, what you expected, what happened, and your browser/OS. If it's
about data disappearing, say whether you had an export/backup and whether the optional Supabase
sync was configured — the app stores everything in this browser's localStorage.

By contributing you agree your work is licensed under the project's [GNU AGPL v3.0](LICENSE).
