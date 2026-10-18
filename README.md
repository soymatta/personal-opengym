<div align="center">

<img src="assets/banner.png" alt="openGym" width="720">

<br>

**A gym & body-weight tracker that runs entirely in your browser.**

Plan your week, run guided workouts, track every set and your body weight over time —
and keep it all on your own device. No account, no server, no subscription, no ads,
and no AI. Your data is a file you can export, read and take anywhere.

<br>

[![License: AGPL v3](https://img.shields.io/badge/license-AGPL--3.0-a3e635?style=flat-square)](LICENSE)
![PWA](https://img.shields.io/badge/PWA-installable-a78bfa?style=flat-square)
![React](https://img.shields.io/badge/React-19-38bdf8?style=flat-square&logo=react&logoColor=white)
![No tracking](https://img.shields.io/badge/telemetry-none-f472b6?style=flat-square)
![No backend](https://img.shields.io/badge/backend-none-94a3b8?style=flat-square)

</div>

<br>

<div align="center">
<table>
<tr>
<td align="center"><img src="assets/screenshots/home.png" alt="Home" width="230"><br><sub><b>Home</b> — today's workout & weight</sub></td>
<td align="center"><img src="assets/screenshots/workout.png" alt="Workout" width="230"><br><sub><b>Guided workout</b> — animated demos & sets</sub></td>
<td align="center"><img src="assets/screenshots/stats.png" alt="Stats" width="230"><br><sub><b>Stats</b> — heatmap, charts & PRs</sub></td>
</tr>
<tr>
<td align="center"><img src="assets/screenshots/library.png" alt="Library" width="230"><br><sub><b>Library</b> — 1,324 exercises, filterable by equipment</sub></td>
<td align="center"><img src="assets/screenshots/plan.png" alt="Plan" width="230"><br><sub><b>Plan</b> — a routine per weekday, ready-made plans</sub></td>
</tr>
</table>
</div>

<br>

> ### 🍴 A personal fork
>
> This is a fork of [DuarteSantos8/openGym](https://github.com/DuarteSantos8/openGym) turned
> into a **PWA-only** app. The upstream AI Coach, the Node/Docker backend and every login
> screen have been removed. What's left is the tracker itself, installable as a home-screen
> app on any device, storing everything locally in the browser.
>
> Three additions beyond removing things:
> - **A file you can feed to any AI you like.** One tap exports your whole training history as
>   a clean JSON (or NDJSON) document — plan, week schedule, every set — that you can paste into
>   a chat instead of having a coach baked into the app. Read it back in, losslessly.
> - **Optional cloud sync** via [Supabase](docs/SUPABASE_VERCEL.md) (email + password) if you
>   want the same history on your phone and laptop. Off unless you configure it.
> - **A warning before movements that load an injured joint.** Say what hurts in Settings and
>   the session flags any exercise that works it — a reminder, not a diagnosis, and it never
>   blocks a set.

---

## Why

Most workout apps lock your data behind a login on their servers, nag you to upgrade, or
disappear when the startup does. This fork is the opposite: **there is no server at all.** The
app is static files. Your training lives in your browser's local storage, exports to a file you
own, and works fully offline. It still feels modern — installable as a home-screen app, offline
support, dark/light themes.

## Features

- ⚖️ **Body-weight tracking** — interactive chart with a goal line you set, gains/losses colored by whether they move toward it
- 🏋️ **Weekly plan** — a routine per weekday, over a library of **1,324 exercises** (searchable, with animated demos)
- 🗓️ **Reschedule any day** — sick, missed a session, or fewer gym days this week? Move a workout to another day without touching your weekly plan
- ▶️ **Guided workouts** — it knows what day it is and starts today's session; asks your body weight first, pre-fills your weights from last time, rest timer, PR detection, per-exercise weight tracking
- ☀️ **The screen stays awake while you train** — no unlocking the phone and finding your place again between every set. On for as long as a workout is running, released the moment you finish it, and switchable off in Settings
- 🔗 **Supersets** — build them, and log them back-to-back with a rest only after the pair
- ⏱️ **Timed exercises** — planks, hangs, wall sits and loaded carries are logged by time, not reps, with a work timer that counts the set itself (separate from the rest timer) and logs the time you actually held. They can carry weight too
- 📈 **Progression that follows a rule** — pick one per routine, override it per exercise: linear, **Greyskull LP** (AMRAP top set, double jumps, 10 % resets), double progression through a rep range, or adding time. Your weights are already right when the session opens, and every target says *why* it's that number. Missed reps never advance the load, stalls trigger a deload, and bodyweight exercises progress in reps instead
- 💪 **Estimated 1RM** — per exercise, from your best eligible set (it names which one), with its own progress curve and a calculator for sets you haven't done. Won't guess above 12 reps
- 🎯 **Effort per set, in your scale** — an optional third column rating how hard a set was, as **RIR** (reps left in the tank) or **RPE** (the same judgement on a 10-point scale). Off by default; each set keeps the scale it was logged with, and nothing else reads the value — your progression and 1RM are unaffected
- 🧮 **Plate calculator** — tap the bar on any barbell exercise and it says what goes on each side, and tells you the truth when the target can't be built from the plates you have ("2.5 kg short of 102.5")
- 🎚️ **Percentage programming (5/3/1-style)** — pick a wave per exercise (65/75/85, 70/80/90, 75/85/95, or a deload) and the session opens on exactly those weights and reps, taken from a training max of 90 % of your best estimated 1RM (or one you set by hand), with the number explained on screen
- 🗒️ **A note per exercise** — a cue, a seat height, how it felt. Written down while you train and shown again above that exercise the next time
- 📏 **Body measurements** — neck, chest, waist, hips, thigh, arm, tracked next to your weight and stored in cm whatever your profile displays
- 🧰 **Plans you can start today** — a 5×5, an upper/lower split or a full-body rotation, loaded in one tap with the exercises, sets and reps already set up
- 🩹 **Injured joints get a warning** — mark what hurts (knee, hip, lower back, shoulder…) and any exercise that loads it says so before you start the set, naming the joint. It reads the muscles each movement works, so it catches what the name alone would not. A reminder, not a medical device, and never a block
- 🏃 **Cardio** — log time + speed, not just weight × reps
- 📤 **Share a plan** — send someone your routines and week schedule as a small file (no workouts, no weigh-ins), or print it as a clean PDF. Importing merges, so their plan is never overwritten
- 🔧 **Filter by equipment** — narrow the library to what you actually own; the options adapt to what you've picked, so every combination on screen has results behind it
- ✨ **Your own exercises** — a name and a body part is enough; they behave like built-in ones everywhere, with an optional description instead of an animation
- 🟩 **Activity heatmap** — a GitHub-style year view, shaded by time spent training
- 💪 **Muscle map** — a front-and-back body diagram shaded by how much work each muscle got, over a week, a month or all time. It names the muscles you *haven't* trained in that period, previews what a routine hits while you build it, and shows what you just trained when you finish. Male or female figure, your pick
- 🌍 **8 languages** — full UI translation (EN, DE, ES, FR, IT, PT, ZH, HI); exercise instructions localized in 6 of them, loaded on demand so the app stays fast
- 📥 **Bring your history with you** — import from **FitNotes** (Android and iOS), **Strong** and **Hevy**, or body weight straight out of an **Apple Health** export. Exercise names are matched against the library and anything unrecognised becomes one of your own exercises, so nothing in the file is dropped
- 🤖 **AI-friendly export** — no AI ships in the app, but your history does. Export everything (plan, schedule, every set) as one **JSON** document or as **NDJSON** — one set per line — and paste it into whatever model you use. Import it back losslessly. See **[AI export](#ai-friendly-export)**
- 📦 **Yours to keep** — one-tap JSON export/import, local-only, **no telemetry**
- 📱 **Installable everywhere** — Android, iOS and desktop all run the same PWA; "Add to Home screen" and it opens full-screen, offline

## Quick start

```bash
git clone https://github.com/soymatta/personal-opengym
cd personal-opengym/frontend
npm ci
npm run dev
```

> Cloning **upstream** (`DuarteSantos8/openGym`) gives you the original app — backend, AI Coach
> and login included. This fork is the one without them; the differences are in the
> [fork note below](#a-personal-fork) and in [CHANGELOG.md](CHANGELOG.md).

Open the printed URL. That's it — no backend, no database, no `.env` needed.

To build and serve the static app:

```bash
cd frontend
npm run build      # → frontend/dist
npm run preview     # serve the build locally
```

## Deploy

The build (`frontend/dist`) is a pile of static files — host it anywhere: Vercel, Netlify,
GitHub Pages, Cloudflare Pages, or a folder on your own webserver. On Vercel the project's
**Root Directory is `frontend`** (the app is not at the repository root): that is what
`frontend/vercel.json` and `frontend/.nvmrc` configure, and Node 22.12+ is required — Vite 8
refuses to build on 18. Deploying the whole repository instead (`Root Directory` `/`) works too,
and then the root `vercel.json`, `.nvmrc` and `.vercelignore` are the ones that apply — see
**[docs/SUPABASE_VERCEL.md](docs/SUPABASE_VERCEL.md)** for both, and don't mix them.

- **Want it on your phone from your own host?** Add it to the home screen instead of visiting a
  URL — it then runs full-screen and offline. The app registers a service worker automatically
  over HTTPS.
- **Want the same history on two devices?** Configure the optional Supabase sync — see
  **[docs/SUPABASE_VERCEL.md](docs/SUPABASE_VERCEL.md)**.

## Your data

There is no server, so there is no `./data` folder. Everything lives in your browser's
**localStorage** under the key `gym_state_v1`, as a single JSON document: your plan, week
schedule, every logged workout, body weight and settings.

- **Backup / move devices** — Settings → **Export backup (JSON)**, then **Import backup** on the other device.
- Clearing your browser's site data deletes it — so export a backup now and then (the Settings tip says the same).
- Passkey/oauth logins do not exist here; there is nothing to sign in to. An optional Supabase
  account (email + password) only adds cloud sync on top of the local copy.

## AI-friendly export

This fork has no AI Coach — instead it hands *you* the data in a shape any model can read.

Settings → **Data**:

- **Export for AI (JSON)** — one document with your profile, every routine (sets, rep scheme,
  progression rule), the week schedule, and the full logged history flattened to **one record
  per set** (date, exercise, set #, weight, reps/seconds, RIR/RPE, volume, PR flag), plus a
  per-exercise chronological view and a self-describing `schema` block. It carries the raw app
  state, so importing it back restores exactly what you exported.
- **Export for AI (NDJSON)** — the same sets as newline-delimited JSON, one object per line.
  The cheapest thing to paste into a chat.

Then ask whatever model you like for a review, a deload plan, a plateau diagnosis — while the
app itself stays completely offline and AI-free.

## Optional cloud sync (Supabase)

Out of the box the app is local-only. If you want your training on more than one device without
running a server, set two Vite env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — see
`frontend/.env.example`), apply `supabase/schema.sql`, and an email + password card appears in
Settings. The cloud copy is a mirror of the same single JSON document; local storage stays the
source of truth and offline still works. Full walkthrough: **[docs/SUPABASE_VERCEL.md](docs/SUPABASE_VERCEL.md)**.

## Tech

React 19 + Vite (React Router, Zustand) · Supabase JS (optional) · Vitest + Playwright for tests ·
exercise data from [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset).
No backend, no database server, no cloud dependency required.

The training logic — progression rules, 1RM estimation, how a logged session is read back —
lives in pure functions under `frontend/src/lib/` with tests next to them.

```bash
cd frontend
npm test        # unit tests (Vitest)
npm run build   # production build
npm run e2e     # end-to-end tests (Playwright)
npm run qa      # all three, in order
```

## Roadmap

- [x] PWA-only, local-first, no backend and no AI
- [x] AI-friendly export / import (JSON + NDJSON)
- [x] Optional Supabase sync
- [x] Percentage / training-max programming (5/3/1-style) on top of the progression engine
- [x] More starter plans (upper/lower, full-body, 5×5)
- [x] Body measurements (waist, arms…) alongside weight
- [x] Per-exercise notes & plate calculator
- [ ] Exercise instructions in German & Portuguese (UI is translated; upstream dataset doesn't ship these yet)

The last one is blocked upstream, not here: the dataset has instructions in ten languages
(EN, ES, FR, IT, PL, RU, TR, ZH, KO, HI) and **zero** in German or Portuguese, so both fall back
to English with a note on the exercise. Filling it means either a second dataset with its own
licence terms (RepDB ships German, attribution required, no redistribution) plus a name-matched
mapping of 1,324 exercises — where a wrong match teaches the wrong movement — or a hand-written
pack for the exercises the ready-made plans actually use.

## Contributing

Issues and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Good first issues: more starter
plans, exercise-data languages, import from other trackers.

## License

[GNU AGPL v3.0](LICENSE) — free and open source. You can use, modify and share it; if you run a
modified version as a network service, you must offer that version's source under the same
license. Nobody can turn openGym into a closed, proprietary product.

Exercise images/GIFs come from the upstream dataset and keep their own terms — see [NOTICE.md](NOTICE.md).
