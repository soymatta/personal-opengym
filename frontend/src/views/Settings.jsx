import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, DEF, hasData } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import { ACCENTS, todayISO } from '../lib/format.js'
import { effortOf } from '../lib/history.js'
import { wakeLockSupported } from '../lib/wakelock.js'
import { t, LANGS, INSTR_LANGS } from '../lib/i18n.js'
import { DEMO, REPO } from '../lib/demo.js'
import { IS_ANDROID } from '../lib/platform.js'
import { downloadFile } from '../lib/history-export.js'
import { buildAiExport, aiToNDJSON, aiFilename, readAnyImport } from '../lib/data-export.js'
import { isSupabaseConfigured, sbSignIn, sbSignUp } from '../lib/supabase.js'
import { loadStarterPlan, confirmSheet, importFromApp, exerciseExportPicker, dayExportPicker } from '../sheets.jsx'
import { JOINTS } from '../lib/injuries.js'
import Icon from '../components/Icon.jsx'
import { Section, Row, SelectRow, Switch, Segmented, Button, TextField } from '../components/ui.jsx'

const clone = o => JSON.parse(JSON.stringify(o))

export default function Settings() {
  const nav = useNavigate()
  const S = useStore(s => s.S)
  const sbUser = useStore(s => s.sbUser)
  const cloud = isSupabaseConfigured() && !DEMO
  const { update, replaceState, pullState, pushState, resetDemo } = useStore()
  const toast = useUI(s => s.toast)
  const fileRef = useRef(null)
  const importRef = useRef(null)
  const wakeOK = wakeLockSupported()
  const injuries = S.injuries || []

  const doExport = () => {
    downloadFile(JSON.stringify(S, null, 2), 'opengym-backup-' + todayISO() + '.json', 'application/json')
    toast(t('Backup exported'))
  }
  // AI-friendly: everything in one document, plus an NDJSON variant (one set per line) that
  // is the cheapest thing to paste into a model. Both round-trip back through Import.
  const doExportAi = kind => {
    const ai = buildAiExport(S)
    if (kind === 'ndjson') downloadFile(aiToNDJSON(ai), aiFilename('ndjson'), 'application/x-ndjson')
    else downloadFile(JSON.stringify(ai, null, 2), aiFilename('json'), 'application/json')
    toast(t('AI export saved'))
  }
  const doImport = ev => {
    const f = ev.target.files[0]; ev.target.value = ''; if (!f) return
    const rd = new FileReader()
    rd.onload = () => {
      try {
        const { state, kind } = readAnyImport(rd.result)
        confirmSheet({
          title: kind === 'ai' ? t('Import AI export?') : t('Import backup?'),
          message: t('This replaces all current data with the backup file.'),
          confirmText: t('Import'), danger: true,
          onConfirm: () => { replaceState(Object.assign(clone(DEF), state), true); toast(t('Backup imported')) },
        })
      } catch (e) { toast(t('Import failed: {0}', t(e.message))) }
    }
    rd.readAsText(f)
  }

  return <div className="narrow">
    <div className="hdr">
      <button className="iconbtn" onClick={() => nav('/home')} aria-label={t('Home')}><Icon name="chevronLeft" /></button>
      <div style={{ flex: 1, marginLeft: 10 }}><h1>{t('Settings')}</h1></div>
    </div>

    {/* ---------- account ----------
        No login is required: everything lives in this browser. A Supabase email+password
        account is optional and only adds cloud sync across devices (see docs). */}
    <Section title={DEMO ? t('Demo') : t('Account')}>
      {DEMO ? <>
        <Row icon="sparkles" iconTint="var(--acc)" title={t('You’re in the demo')} subtitle={t('Example data, stored only in this browser — change anything you like.')} />
        <Row icon="reset" iconTint="var(--blue)" title={t('Reset demo data')} accessory="chevron"
          onClick={() => confirmSheet({ title: t('Reset demo data?'), message: t('Puts the example plan, workouts and weigh-ins back the way they started.'), confirmText: t('Reset'), onConfirm: () => { resetDemo(); nav('/home'); toast(t('Demo data reset')) } })} />
      </> : <>
        <Row icon="lock" iconTint="var(--acc)" title={t('No account needed')}
          subtitle={t('Your training is stored in this browser. Export a backup from Data below anytime.')} />
        {sbUser && <Row icon="personCircle" iconTint="var(--blue)" title={sbUser.email || t('Cloud account')} subtitle={t('Signed in with email — training syncs across devices.')} />}
      </>}
      <Row icon="rocket" iconTint="var(--indigo)" title={t('Get the source')}
        subtitle={t('Free & open source — run it yourself with your own cloud.')} accessory="chevron"
        onClick={() => window.open(REPO, '_blank', 'noopener')} />
    </Section>
    {!cloud && <p className="sect-f" style={{ marginTop: -18, marginBottom: 22 }}>{t('On this device only — data never leaves this browser unless you export it.')}</p>}

    {cloud && <SupabaseCard />}

    {/* ---------- general ---------- */}
    <Section title={t('General')} footer={t('Note: switching units only changes the label — logged numbers are not converted.')}>
      <SelectRow
        icon="globe" iconTint="var(--blue)" title={t('Language')}
        value={S.lang || 'en'} onChange={v => update(s => { s.lang = v })}
        options={Object.entries(LANGS).map(([k, name]) => ({
          value: k, label: name,
          subtitle: INSTR_LANGS.includes(k) ? null : t("Exercise instructions aren't available in this language yet — they stay in English."),
        }))}
      />
      <Row icon="scale" iconTint="var(--teal)" title={t('Weight unit')}>
        <Segmented className="seg-inline"
          options={[{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }]}
          value={S.unit} onChange={v => update(s => { s.unit = v })} />
      </Row>
    </Section>

    {/* ---------- during a workout ---------- */}
    <Section title={t('During a workout')} footer={wakeOK ? t('The screen stays on while a workout is running, so you don’t have to unlock your phone between sets.') : null}>
      {/* 0 means "no timer at all", and it is a real choice rather than a disabled control:
          circuits, warm-ups and back-to-back supersets are often trained with no planned rest. */}
      <SelectRow icon="timer" iconTint="var(--orange)" title={t('Rest timer')}
        value={S.restSec ?? 90} onChange={v => update(s => { s.restSec = v })}
        options={[{ value: 0, label: t('No rest') }, ...[60, 90, 120, 150, 180].map(v => ({ value: v, label: v + 's' }))]} />
      <Row icon="sun" iconTint="var(--yellow)" title={t('Keep screen awake')}
        subtitle={wakeOK ? null : t('Not supported in this browser.')}>
        <Switch checked={wakeOK && S.keepAwake !== false} disabled={!wakeOK}
          onChange={v => update(s => { s.keepAwake = v })} />
      </Row>
      <Row icon="bell" iconTint="var(--pink)" title={t('Sounds')}>
        <Switch checked={!!S.sound} onChange={v => update(s => { s.sound = v })} />
      </Row>
      {/* Two names for the same judgement, so the column asks in the scale you already think in.
          The (i) sits before the control — you read it on the way to the choice, not after it. */}
      <Row icon="target" iconTint="var(--purple)" title={t('Effort per set')}>
        <button className="helpbtn" aria-label={t('What are RIR and RPE?')} onClick={effortHelpSheet}><Icon name="info" /></button>
        <Segmented className="seg-inline"
          options={[{ value: 'none', label: t('Off') }, { value: 'rir', label: t('RIR') }, { value: 'rpe', label: t('RPE') }]}
          value={effortOf(S)} onChange={v => update(s => { s.effort = v; delete s.showRir })} />
      </Row>
    </Section>

    {/* ---------- injuries ---------- */}
    <Section title={t('Injuries')} footer={t('Not a medical device — a reminder, so a sore joint is not the thing you forget between sets.')}>
      <Row icon="shield" iconTint="var(--orange)" title={t('What hurts')}
        subtitle={t('Pick the joints to watch. You get a warning before a movement that loads one.')} />
      {/* Wrapped, not scrolled like the Library's filter row: this is a list of switches, and a
          switch you have to scroll sideways to discover is a switch half the users never set. */}
      <div className="chips" style={{ marginTop: 4, flexWrap: 'wrap' }}>
        {JOINTS.map(j => {
          const on = injuries.includes(j)
          return <button key={j} className={'chip' + (on ? ' on' : '')}
            aria-pressed={on}
            onClick={() => update(s => {
              const list = s.injuries || []
              s.injuries = on ? list.filter(x => x !== j) : [...list, j]
            })}>{t(j)}</button>
        })}
      </div>
    </Section>

    {/* ---------- appearance ---------- */}
    <Section title={t('Appearance')}>
      <Row icon="moon" iconTint="var(--indigo)" title={t('Theme')}>
        <Segmented
          className="seg-inline"
          options={[{ value: 'dark', icon: 'moon', label: t('Dark') }, { value: 'light', icon: 'sun', label: t('Light') }]}
          value={S.theme === 'light' ? 'light' : 'dark'}
          onChange={v => update(s => { s.theme = v })}
        />
      </Row>
      {/* Purely how the muscle map is drawn — nothing else in the app reads this. */}
      <Row icon="figureStrength" iconTint="var(--teal)" title={t('Body diagram')}>
        <Segmented
          className="seg-inline"
          options={[{ value: 'male', label: t('Male') }, { value: 'female', label: t('Female') }]}
          value={S.body === 'female' ? 'female' : 'male'}
          onChange={v => update(s => { s.body = v })}
        />
      </Row>
      <div className="lrow" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12, paddingTop: 13, paddingBottom: 14 }}>
        <span className="lrow-t">{t('Accent color')}</span>
        <div className="swatches">
          {Object.entries(ACCENTS).map(([k, c]) => (
            <button key={k} className={'swatch' + ((S.accent || 'lime') === k ? ' on' : '')}
              style={{ background: c }} onClick={() => update(s => { s.accent = k })} aria-label={k} />
          ))}
        </div>
      </div>
    </Section>

    {/* ---------- data: fill it, bring things over, hand it to an AI, back it up, wipe it ---------- */}
    <Section title={t('Data')}>
      <Row icon="sparkles" iconTint="var(--acc)" title={t('Load starter plan (PPL)')} accessory="chevron" onClick={loadStarterPlan} />
      <Row icon="shuffle" iconTint="var(--teal)" title={t('Import from another app')}
        subtitle={t('FitNotes, Strong, Hevy — or body weight from Apple Health')}
        accessory="chevron" onClick={() => importRef.current.click()} />
      <Row icon="download" iconTint="var(--teal)" title={t('Export by exercise (CSV/JSON)')}
        subtitle={t('Set-by-set history of one exercise with dates')}
        accessory="chevron" onClick={exerciseExportPicker} />
      <Row icon="download" iconTint="var(--teal)" title={t('Export by day (CSV/JSON)')}
        subtitle={t('Every set logged on one day')}
        accessory="chevron" onClick={dayExportPicker} />
      <Row icon="sparkles" iconTint="var(--purple)" title={t('Export for AI (JSON)')}
        subtitle={t('Everything — plan, schedule and full history — in one file an AI can read.')}
        accessory="chevron" onClick={() => doExportAi('json')} />
      <Row icon="sparkles" iconTint="var(--purple)" title={t('Export for AI (NDJSON)')}
        subtitle={t('Same history, one set per line — easiest to paste into a chat.')}
        accessory="chevron" onClick={() => doExportAi('ndjson')} />
      <Row icon="upload" iconTint="var(--blue)" title={t('Import backup or AI export')} accessory="chevron" onClick={() => fileRef.current.click()} />
      <Row icon="download" iconTint="var(--blue)" title={t('Export backup (JSON)')} accessory="chevron" onClick={doExport} />
      <Row icon="trash" iconTint="var(--red)" title={t('Reset everything')} danger onClick={() => confirmSheet({ title: t('Reset everything?'), message: t('Deletes your plan, workouts and body weight on this device. This cannot be undone.'), confirmText: t('Delete everything'), danger: true, onConfirm: () => { replaceState(clone(DEF), true); nav('/home'); toast(t('All data reset')) } })} />
    </Section>
    <input ref={fileRef} type="file" accept=".json,.ndjson,application/json" style={{ display: 'none' }} onChange={doImport} />
    {/* Reset after reading so picking the same file twice still fires onChange. */}
    <input ref={importRef} type="file" accept=".csv,.xml,text/csv,text/xml" style={{ display: 'none' }}
      onChange={ev => { const f = ev.target.files[0]; if (f) importFromApp(f); ev.target.value = '' }} />

    <Section title={t('Tip')}>
      <Row icon="lightbulb" iconTint="var(--yellow)"
        title={IS_ANDROID ? t('In Chrome: ⋮ menu → Add to Home screen') : t('In Safari: Share → Add to Home Screen')}
        subtitle={t('to install Personal Open Gym as a full-screen app.') + ' ' + t('Data stays on this device — export a backup now and then!')} />
    </Section>

    <div className="dim small" style={{ textAlign: 'center', marginTop: 4, lineHeight: 1.6 }}>
      Personal Open Gym · {t('free & open source (AGPL v3)')}<br />
      <a href="https://github.com/DuarteSantos8/openGym" target="_blank" rel="noopener">source code</a> · exercise data: hasaneyldrm/exercises-dataset (CC)
    </div>
  </div>
}

// The whole point is that the two scales are one judgement counted from opposite ends, and a
// paragraph is a bad way to say that — the conversion table shows it in one look. Reading down
// a column is the answer to "what do I put here", so the numbers get their own aligned columns.
const EFFORT_ROWS = [
  ['0', '10', 'Nothing left — went to failure'],
  ['1', '9', 'One more rep in the tank'],
  ['2', '8', 'Two more reps'],
  ['3', '7', 'Three more reps'],
  ['4+', '≤6', 'Easy — warm-up territory'],
]
// RIR 2 / RPE 8: the row a working set usually lands on — the anchor the others are read
// against. Not where the stepper starts; + walks up from the bottom of the scale.
const EFFORT_TYPICAL = 2

function effortHelpSheet() {
  useUI.getState().openSheet(close => <>
    <h3>{t('Effort per set')}</h3>
    <div className="muted small" style={{ lineHeight: 1.5 }}>
      {t('How hard a set was, logged next to weight and reps. Two scales for the same judgement, counted from opposite ends.')}
    </div>
    <div className="efftbl">
      <div className="r hd"><span className="n">{t('RIR')}</span><span className="n">{t('RPE')}</span><span className="f">{t('How it felt')}</span></div>
      {EFFORT_ROWS.map(([rir, rpe, feel], i) => (
        <div key={rir} className={'r' + (i === EFFORT_TYPICAL ? ' on' : '')}>
          <span className="n">{rir}</span><span className="n">{rpe}</span><span className="f">{t(feel)}</span>
        </div>
      ))}
    </div>
    <div className="dim small" style={{ lineHeight: 1.5, display: 'grid', gap: 8 }}>
      <div>{t('RIR counts the reps you left; RPE reads the same effort off a 10-point scale — so RPE ≈ 10 − RIR. Pick the one you already think in.')}</div>
      <div>{t('The highlighted row is where most working sets land. Sets you have already logged keep their own scale, and nothing else reads the value — progression and estimated 1RM are unaffected.')}</div>
    </div>
    <div style={{ height: 8 }} />
  </>)
}

// Optional multi-device sync. Only rendered when VITE_SUPABASE_* is configured; otherwise
// the app is purely local and this card never appears.
function SupabaseCard() {
  const toast = useUI(s => s.toast)
  const pullState = useStore(s => s.pullState)
  const pushState = useStore(s => s.pushState)
  const setSbUser = useStore(s => s.setSbUser)
  const sbSignOutStore = useStore(s => s.sbSignOut)
  const sbUser = useStore(s => s.sbUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const go = async (mode) => {
    setErr('')
    if (!email.trim() || !password) { setErr(t('Enter email and password')); return }
    if (password.length < 6) { setErr(t('Password needs at least 6 characters')); return }
    setBusy(true)
    try {
      const session = mode === 'up' ? await sbSignUp(email.trim(), password) : await sbSignIn(email.trim(), password)
      if (session?.user) {
        setSbUser(session.user)
        if (mode === 'up') {
          if (hasData(useStore.getState().S)) { await pushState(); toast(t('Account created — this device pushed to cloud')) }
          else { await pullState(); toast(t('Welcome — cloud sync is on')) }
        } else { await pullState(); toast(t('Cloud sync on — pulled latest')) }
        setPassword('')
      } else {
        // Email confirmation ON in Supabase: no session until the link is clicked.
        toast(t('Account created — check your email to confirm, then sign in'))
      }
    } catch (e) { setErr(e.message ? t(e.message) : t('Sign-in failed')) }
    setBusy(false)
  }
  const out = async () => {
    await sbSignOutStore()
    toast(t('Cloud sync off on this device — local data stays'))
  }
  const syncNow = async () => {
    setBusy(true)
    try { await pullState(); await pushState(); toast(t('Synced with cloud')) }
    catch (e) { toast(e.message ? t(e.message) : t('Sync failed')) }
    setBusy(false)
  }
  return (
    <Section title={t('Cloud sync (Supabase)')} footer={t('Same login on every device = same history. Email + password verified on the server — no Google/GitHub OAuth. Offline still works locally.')}>
      {sbUser ? <>
        <Row icon="shuffle" iconTint="var(--blue)" title={t('Sync now')} subtitle={t('Pull latest, then push this device.')} accessory="chevron" onClick={syncNow} />
        <Row icon="signOut" iconTint="var(--red)" title={t('Sign out of cloud')} subtitle={t('Stops syncing here; your data stays on this device.')} danger onClick={out} />
      </> : <>
        <div className="muted small" style={{ marginBottom: 10 }}>{t('Sign in with email to sync your training across phone, tablet and PC. New here? Create account with the same form.')}</div>
        <TextField value={email} onChange={e => setEmail(e.target.value)} placeholder="email" autoCapitalize="none" autoCorrect="off" inputMode="email" maxLength={120} />
        <div style={{ height: 8 }} />
        <TextField value={password} onChange={e => setPassword(e.target.value)} placeholder={t('Password (min 6)')} maxLength={120} type="password" />
        {err && <div className="small" style={{ color: 'var(--red)', marginTop: 8 }}>{err}</div>}
        <div style={{ height: 10 }} />
        <div className="row" style={{ gap: 8 }}>
          <Button style={{ flex: 1 }} disabled={busy} onClick={() => go('in')}>{t('Sign in')}</Button>
          <Button style={{ flex: 1 }} variant="primary" disabled={busy} onClick={() => go('up')}>{t('Create account')}</Button>
        </div>
      </>}
    </Section>
  )
}
