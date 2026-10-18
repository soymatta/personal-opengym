#!/usr/bin/env node
// Guards the two invariants that keep the UI readable in every language.
//
//  1. Every locale in src/locales/ carries the SAME key set. English is the source language
//     and has no locale file, so a key that exists in only some locales falls back to
//     English silently, mid-sentence, with nothing failing anywhere.
//  2. Every string a component passes to t('…') is carried by every locale. Locale parity
//     alone cannot see this one: a brand-new t('…') literal that no locale has yet is missing
//     from all eleven at once, which looks exactly like being in sync.
//
//   node scripts/check-locales.mjs
//   node scripts/check-locales.mjs --json    # exact text of every untranslated literal
//   node scripts/check-locales.mjs --stale   # exact text of every key no component asks for
//
// The reference for (1) is the union of all locales, not one blessed file: a key added to a
// single locale then flags the other ten instead of passing unnoticed.
//
// (2) is only as good as its scanner, so the scanner is self-checked at startup against the
// shapes that have fooled it: a quote inside a regex literal (`.replace(/"/g, …)` desynchronised
// the scan for the rest of the file), a literal inside a template interpolation (the print/PDF
// markup is built that way), an apostrophe or a quoted word in JSX text, a JSX closing tag
// (`</h1>` used to read as a regex), and a plain division. If any of those regress, the run fails
// before it can call a half-seen set of strings "in sync".

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const localesDir = join(root, 'src', 'locales')
const srcDir = join(root, 'src')

// Strings that are deliberately English-only, and must stay that way. Keep this empty if at
// all possible — every entry is a hole in the "every language, always" rule, and the report
// at the bottom of a run lists them so they cannot be forgotten.
const ALLOW_ENGLISH_ONLY = new Set([])

const files = readdirSync(localesDir).filter(f => f.endsWith('.js')).sort()

if (!files.length) {
  console.error(`No locale files found in ${localesDir}`)
  process.exit(1)
}

const locales = new Map()
for (const file of files) {
  const { default: dict } = await import(pathToFileURL(join(localesDir, file)).href)
  if (!dict || typeof dict !== 'object') {
    console.error(`${file}: no default-exported object`)
    process.exit(1)
  }
  locales.set(file.replace(/\.js$/, ''), new Set(Object.keys(dict)))
}

// How many locales carry each key — 1 means the key was added to a single file only,
// which is the usual shape of the bug and worth naming separately from plain gaps.
const seen = new Map()
for (const keys of locales.values()) for (const k of keys) seen.set(k, (seen.get(k) || 0) + 1)
const union = [...seen.keys()]

let failed = false
for (const [lang, keys] of locales) {
  const missing = union.filter(k => !keys.has(k))
  const orphans = union.filter(k => keys.has(k) && seen.get(k) === 1)
  if (missing.length || orphans.length) {
    failed = true
    console.error(`\n${lang}.js: ${keys.size}/${union.length} keys`)
    for (const k of missing) console.error(`  missing:   ${JSON.stringify(k)}`)
    for (const k of orphans) console.error(`  only here: ${JSON.stringify(k)}`)
  }
}
if (failed) {
  console.error('\nLocale key sets differ. Every locale must carry the same keys.')
  process.exit(1)
}

/* ------------------------- t('…') literals used in the source ------------------------- */

const isWord = c => !!c && /[\w$]/.test(c)

// Walk one string/template starting at `i`; returns the index just past it.
function skipString(src, i) {
  const quote = src[i]
  i++
  while (i < src.length) {
    const c = src[i]
    if (c === '\\') { i += 2; continue }
    if (c === quote) return i + 1
    i++
  }
  return i
}

// Collect every string literal in the FIRST argument of the call whose "(" sits at `open`, and
// return where the call ends. Only the first argument is a key: the rest are values for the
// {0} placeholders, and wrapping a separator in t() by mistake (t('{0} sets', done + '/' + total))
// must not be reported as an untranslated string.
function scanCall(src, open) {
  const strings = []
  let depth = 0
  let i = open
  while (i < src.length) {
    const c = src[i]
    if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue }
    if (c === '/' && src[i + 1] === '*') { i += 2; while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue }
    if (c === "'" || c === '"' || c === '`') {
      const end = skipString(src, i)
      const raw = src.slice(i + 1, end - 1)
      // A template with an interpolation is a computed key, not a translatable literal.
      if (!(c === '`' && raw.includes('${'))) {
        // Inside a ternary key the literal can also be a *value*: t(sport === 'none' ? 'A' : 'B')
        // — 'none' is compared, 'A'/'B' are shown. Only the displayed side is a key.
        const before = src.slice(open + 1, i).replace(/\s+$/, '')
        const after = src.slice(end).replace(/^\s+/, '')
        const isCompared = /(===|!==|==|!=)$/.test(before) || /^(===|!==|==|!=)/.test(after)
        const isNestedArg = /\w\($/.test(before) && !/(^|[^\w$])t\($/.test(before)
        if (!isCompared && !isNestedArg) strings.push({ text: raw, quote: c })
      }
      i = end
      continue
    }
    if (c === '(') depth++
    else if (c === ')') { depth--; if (depth === 0) return { end: i + 1, strings } }
    else if (c === ',' && depth === 1) return { end: i, strings }
    i++
  }
  return { end: i, strings }
}

// A string ends on the line it starts on: only a `\` continuation carries one further, and that is
// vanishingly rare next to this. So a quote with no partner left on its own line is prose — an
// apostrophe in JSX text like <div>Today's plan</div>, a quote an English sentence happens to use —
// and reading it as a string opener desyncs the scan and hides every literal after it in the file.
// Returns the index past the closing quote, or -1 when the quote is prose.
function sameLineStringEnd(src, i) {
  const q = src[i]
  let j = i + 1
  while (j < src.length && src[j] !== '\n') {
    if (src[j] === '\\') { j += 2; continue }
    if (src[j] === q) return j + 1
    j++
  }
  return -1
}

// A `/` opens a regex literal rather than a division when the last significant character before
// it cannot end an expression. This matters more than it sounds: `esc()` in this app is written
// `.replace(/"/g, '&quot;')`, and reading the `"` inside that pattern as a string opener
// desynchronises the scan — every literal in the rest of the file goes unseen, which is exactly
// how a renamed key slipped past this gate once.
const BEFORE_REGEX = new Set(['(', ',', '=', ':', '[', '!', '&', '|', '?', '{', ';', '+', '-', '*', '%', '<', '>', '~', '^'])
const AFTER_REGEX_KEYWORD = /^(return|typeof|case|in|of|instanceof|new|delete|void|do|else|yield|await)$/

function startsRegex(src, i) {
  // `</h1>` is a JSX closing tag, not a regex. In a JSX file the `<` before the slash is markup,
  // and reading it as the start of a pattern swallows the rest of the element — along with every
  // literal inside it. This one cost the gate a whole shelf of strings before it was found.
  if (src[i - 1] === '<') return false
  let j = i - 1
  while (j >= 0 && /\s/.test(src[j])) j--
  if (j < 0) return true
  const p = src[j]
  if (BEFORE_REGEX.has(p)) return true
  if (/[A-Za-z_$]/.test(p)) {
    let k = j
    while (k >= 0 && /[\w$]/.test(src[k])) k--
    return AFTER_REGEX_KEYWORD.test(src.slice(k + 1, j + 1))
  }
  return false
}

// Index just past a regex literal (pattern, closing slash and flags).
function skipRegex(src, i) {
  let j = i + 1
  let inClass = false
  while (j < src.length) {
    const c = src[j]
    if (c === '\\') { j += 2; continue }
    if (c === '\n') break              // an unterminated pattern is a division — don't swallow the file
    if (c === '[') inClass = true
    else if (c === ']') inClass = false
    else if (c === '/' && !inClass) { j++; break }
    j++
  }
  while (j < src.length && /[a-z]/i.test(src[j])) j++
  return j
}

// Walks from a template literal's opening backtick and returns the index just past its closing
// one, collecting the t('…') literals inside its ${…} interpolations on the way.
//
// A template literal is not opaque: `${t('Routines')}` carries a string a user reads, and the
// print/preview markup in this app is built exactly that way. Skipping templates wholesale would
// leave the gate blind to the literals nested in markup — the ones most likely to be new.
function scanTemplate(src, start, to, out) {
  let i = start + 1
  while (i < to) {
    const c = src[i]
    if (c === '\\') { i += 2; continue }
    if (c === '`') return i + 1
    if (c === '$' && src[i + 1] === '{') {
      let depth = 0
      let j = i + 1
      while (j < to) {
        const d = src[j]
        if (d === '/' && src[j + 1] === '/') { while (j < to && src[j] !== '\n') j++; continue }
        if (d === '/' && src[j + 1] === '*') { j += 2; while (j < to && !(src[j] === '*' && src[j + 1] === '/')) j++; j += 2; continue }
        if (d === '/' && startsRegex(src, j)) { j = skipRegex(src, j); continue }
        if (d === "'" || d === '"') { const e = sameLineStringEnd(src, j); j = e > 0 ? e : j + 1; continue }
        if (d === '`') { j = scanTemplate(src, j, to, out); continue }
        if (d === '{') depth++
        else if (d === '}') { depth--; j++; if (!depth) break; continue }
        else if (d === 't' && src[j + 1] === '(' && !isWord(src[j - 1]) && src[j - 1] !== '.') {
          const { end, strings } = scanCall(src, j + 1)
          strings.forEach(s => { if (s.text) out.push({ text: s.text, index: j }) })
          j = end
          continue
        }
        j++
      }
      i = j
      continue
    }
    i++
  }
  return i
}

// Every t('…') in a module, comments and strings-except-arguments excluded.
function literalsIn(src) {
  const out = []
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue }
    if (c === '/' && src[i + 1] === '*') { i += 2; while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue }
    if (c === '/' && startsRegex(src, i)) { i = skipRegex(src, i); continue }
    if (c === '`') { i = scanTemplate(src, i, src.length, out); continue }
    if (c === "'" || c === '"') { const e = sameLineStringEnd(src, i); i = e > 0 ? e : i + 1; continue }
    // `t(` as a whole word, and not a method call like `format(` or `x.t(`
    if (c === 't' && src[i + 1] === '(' && !isWord(src[i - 1]) && src[i - 1] !== '.') {
      const { end, strings } = scanCall(src, i + 1)
      strings.forEach(s => { if (s.text) out.push({ text: s.text, index: i }) })
      i = end
      continue
    }
    i++
  }
  return out
}

function sourceFiles(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      if (name === 'locales' || name === 'instr' || name === 'node_modules') continue
      out.push(...sourceFiles(full))
      continue
    }
    if (!/\.(js|jsx)$/.test(name) || /\.test\.jsx?$/.test(name)) continue
    out.push(full)
  }
  return out
}

// The scanner is hand-rolled, so it is checked against the three things that have already
// defeated it once: a quote inside a regex literal, a t('…') inside a template interpolation, and
// a quote inside a comment. A scanner that misses literals reports "all translated" about a set of
// strings it never saw — the failure mode this self-check exists to make impossible.
function assertScanner() {
  const cases = [
    ['a regex literal holding a quote does not desync the scan', `const esc = s => s.replace(/"/g, '&quot;')\nconst x = t('After the regex')\n`, ['After the regex']],
    ['a literal inside a template interpolation is seen', 'const h = `<b>${t(\'In markup\')}</b>`\n', ['In markup']],
    ['a literal inside a nested template is seen', 'const h = `<a>${cond ? `<b>${t(\'Nested\')}</b>` : t(\'Flat\')}</a>`\n', ['Nested', 'Flat']],
    ['quotes in comments and strings are not literals', `// t('Commented out')\nconst s = "t('In a string')"\n${'`not a call`'}\n`, []],
    ['a division is not a regex', `const half = width / 2\nconst y = t('After a division')\n`, ['After a division']],
    ['an apostrophe in JSX text is prose, not a string opener', `const el = <div>Today's plan</div>\nconst y = t('After the apostrophe')\n`, ['After the apostrophe']],
    ['a quote inside JSX prose does not hide what follows', `const el = <p>Tap "Start" to begin</p>\nconst y = t('After the quotes')\n`, ['After the quotes']],
    ['a JSX closing tag is not a regex', `const el = <div><h1>{t('Before the close')}</h1>{t('After the close')}</div>\n`, ['Before the close', 'After the close']],
  ]
  for (const [name, src, expected] of cases) {
    const got = literalsIn(src).map(l => l.text)
    const same = got.length === expected.length && expected.every((e, k) => got[k] === e)
    if (!same) {
      console.error(`\ncheck-locales.mjs self-check failed: ${name}`)
      console.error(`  expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`)
      console.error('  The scanner is not trustworthy, so neither is a green run. Fix it first.')
      process.exit(1)
    }
  }
}
assertScanner()

const used = new Map()          // literal -> first file that used it
for (const file of sourceFiles(srcDir)) {
  const src = readFileSync(file, 'utf8')
  for (const { text } of literalsIn(src)) {
    if (!used.has(text)) used.set(text, relative(root, file))
  }
}

const untranslated = []
const allowed = []
for (const [text, file] of used) {
  if (ALLOW_ENGLISH_ONLY.has(text)) { allowed.push(text); continue }
  const missing = [...locales].filter(([, keys]) => !keys.has(text)).map(([lang]) => lang)
  if (missing.length) untranslated.push({ text, file, missing })
}

if (untranslated.length) {
  // --json emits the exact key text, so a fix can be scripted without retyping (and mistyping)
  // any string: the checker stays the single source of truth for what is missing.
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(untranslated.map(u => ({ key: u.text, file: u.file, missing: u.missing })), null, 2))
    process.exit(1)
  }
  console.error(`\n${untranslated.length} string(s) used in the UI but missing from a locale:`)
  for (const u of untranslated) {
    console.error(`  ${JSON.stringify(u.text)}`)
    console.error(`    ${u.file}  ->  missing in: ${u.missing.join(', ')}`)
  }
  console.error('\nAdd every new string to ALL locales (see AGENTS.md). English-only strings must')
  console.error('be listed in ALLOW_ENGLISH_ONLY in this script, with a reason.')
  process.exit(1)
}

console.log(`${locales.size} locales, ${union.length} keys each — in sync.`)
console.log(`${used.size} t('…') literals in src/ — all translated${allowed.length ? `, ${allowed.length} allowed English-only` : ''}.`)

// The other direction, as a warning rather than a failure: a key every locale carries while no
// component asks for it is dead weight in 11 files at once. It is not a bug — nothing breaks, the
// string is simply never rendered — so it must not fail a run or block a commit. What it must not
// be either is invisible: features get removed (the AI coach, the passkey login, push reminders)
// and their translations stay behind, in every language, forever.
//
// A computed key shows up here as stale even though the UI uses it (`t('{0}: ' + field)`), so treat
// the list as candidates: check before deleting. `--stale` prints the exact keys, for the same
// reason `--json` does.
const stale = union.filter(k => !used.has(k))
if (stale.length) {
  if (process.argv.includes('--stale')) console.log(JSON.stringify(stale, null, 2))
  else console.log(`${stale.length} keys no component asks for — dead translations, delete candidates (--stale lists them).`)
}
