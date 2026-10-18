# Security policy

openGym is a **static, local-first app**: there is no server, so there is nobody storing your
data but your own browser. This file says which versions get fixes, how to report something
privately, and — the part most people actually need — what the app protects you from and what it
doesn't.

## Supported versions

Only the **latest release**. Releases are semver tags (see [CHANGELOG.md](CHANGELOG.md)); there is
no LTS or maintenance branch and older tags are never patched.

Updating a self-hosted instance is just redeploying the static build: `git pull`, then rebuild
(`cd frontend && npm ci && npm run build`) and republish `frontend/dist`.

## Reporting a vulnerability

Use GitHub's private vulnerability reporting — repo **Security** tab → **Report a vulnerability**:

<https://github.com/soymatta/personal-opengym/security/advisories/new>

> Private reporting has to be switched on in the repository settings for that link to work
> (Settings → Advanced Security → Private vulnerability reporting). If it 404s, open a normal
> issue saying only *"I need a private channel for a security report"* — no details, no repro —
> and it will be enabled.

Please don't put a working exploit in a public issue if it can be used against other people's
deployments. Everything else (a crash you can only trigger yourself, a scanner warning) is fine
as a normal issue.

Useful in a report: the version or commit, your browser/OS, whether optional Supabase sync was
configured, steps to reproduce, and what an attacker gets out of it.

**On response times:** this is a hobby project maintained by one person alongside school. There
is no SLA and no bounty. Expect days rather than hours, and longer during exam periods.

## In scope

- **The frontend** — XSS in the React app, or anything that lets a page on another origin read or
  change your stored training data.
- **The service worker** (`frontend/public/sw.js`) — a caching behaviour that could serve stale
  or attacker-influenced content.
- **The optional Supabase sync** — a way to read or write another account's state, or a leaked
  anon key handled incorrectly by the app.
- **Shipped deployment config** — `vercel.json`, the CI workflows: a default that exposes
  something you wouldn't expect.

## Out of scope

- **Loss of data you didn't back up.** The app stores everything in your browser's localStorage;
  clearing site data deletes it. Export a backup (Settings → Data) — this is documented behaviour,
  not a bug.
- **Anything that already assumes access to your device or your browser profile.** If someone can
  run code in your browser or on your machine, they can read your training data.
- **Third-party content** — the exercise image/GIF dataset and the CDN it's fetched from.
- **The Supabase project you point the app at.** That's your cloud provider and your config; the
  app only mirrors its local document there.
- Scanner output with no working exploit, and `npm audit` findings in build-time devDependencies
  (Vite, Vitest, Playwright) that never reach a running app.

## Security model

### What it does

- **No server, no account by default.** The app is static files. Your plan, workouts and body
  weight live in your browser's `localStorage` under `gym_state_v1`. Nothing is transmitted
  anywhere unless you configure the optional Supabase sync.
- **No login gate.** There is nothing to authenticate against locally; opening the app opens your
  data, exactly as any local-first tool behaves.
- **Optional cloud sync is opt-in and explicit.** Only when `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_ANON_KEY` are set does an email + password card appear, and only a signed-in user
  reads/writes their own row (`gym_states`, keyed by the Supabase auth user id, protected by
  Supabase Row Level Security). Local storage stays the source of truth; the cloud is a mirror.
- **Exports are local files.** Backup and AI exports are generated in the browser and downloaded
  or shared via the Web Share API — they never touch a server.
- **Service worker** only caches same-origin GETs (app assets and media); it never caches
  credentialed requests.

### What it does not do

- **Nothing is encrypted at rest.** `localStorage` is readable by any script running on the app's
  origin and by anyone with access to your browser profile. Treat your exported JSON backups the
  same way — they are plain text.
- **No secrets in the app.** There is no API key, no server credential, and no push key. The
  Supabase anon key (if used) is a public client key by design, gated by RLS — never put a
  Supabase *service* key in the frontend.
- **HTTPS is required for the PWA features, and the app doesn't provide it.** The service worker
  and installability need HTTPS (localhost is the exception). Host it behind TLS; over plain
  `http://` it degrades to a normal web page.
- **XSS is the boundary.** Because the data lives in localStorage, a cross-site scripting bug in a
  dependency or in the app would expose it. Keep dependencies minimal, avoid `dangerouslySetInnerHTML`,
  and keep the import parsers (backup, AI export, CSV) validating their input.
- **A backup file is a full copy of your data.** Anyone you send one to can read your entire
  history. That's the point — but share deliberately.
