// Supabase cloud sync (optional — multi-device without a self-hosted server).
//
// Design: the whole training state stays ONE JSON document (the exact shape the app stores
// in localStorage), stored as jsonb in `gym_states` keyed by the Supabase auth user id.
// Offline-first: localStorage stays the source of truth, Supabase is just the cloud mirror
// every device pulls/pushes. Auth is email + password, verified by Supabase itself (no
// social OAuth).
//
// If VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are unset, every helper below is a no-op
// and the app behaves exactly as before (local only).

let client = null
let clientPromise = null

export const isSupabaseConfigured = () =>
  !!(import.meta.env?.VITE_SUPABASE_URL && import.meta.env?.VITE_SUPABASE_ANON_KEY)

export async function getSupabase() {
  if (client) return client
  if (!isSupabaseConfigured()) return null
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) => {
      client = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
      )
      return client
    })
  }
  return clientPromise
}

export async function sbSession() {
  const sb = await getSupabase()
  if (!sb) return null
  const { data } = await sb.auth.getSession()
  return data?.session || null
}

export async function sbSignIn(email, password) {
  const sb = await getSupabase()
  if (!sb) throw new Error('Supabase is not configured')
  const { data, error } = await sb.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.session
}

export async function sbSignUp(email, password) {
  const sb = await getSupabase()
  if (!sb) throw new Error('Supabase is not configured')
  const { data, error } = await sb.auth.signUp({ email, password })
  if (error) throw error
  return data.session
}

export async function sbSignOut() {
  const sb = await getSupabase()
  if (!sb) return
  await sb.auth.signOut()
}

// Auth-state listener (login/logout in another tab or on refresh).
// Returns an unsubscribe fn. Safe no-op when Supabase is not configured.
export async function onSbAuthChange(cb) {
  const sb = await getSupabase()
  if (!sb) return () => {}
  const { data } = sb.auth.onAuthStateChange((_event, session) => cb(session?.user || null))
  return () => data?.subscription?.unsubscribe()
}

// Push: upsert whole state (minus the in-progress workout).
export async function sbPush(state) {
  const sb = await getSupabase()
  if (!sb) return false
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return false
  const clean = { ...state }
  delete clean.active
  const { error } = await sb.from('gym_states').upsert(
    { user_id: user.id, state: clean, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' },
  )
  if (error) throw error
  return true
}

// Pull: newest wins between local and cloud (by _ts).
export async function sbPull(localTs) {
  const sb = await getSupabase()
  if (!sb) return null
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null
  const { data, error } = await sb.from('gym_states').select('state,updated_at').eq('user_id', user.id).maybeSingle()
  if (error) throw error
  if (!data?.state) return null
  const remoteTs = data.state._ts || 0
  if (remoteTs >= (localTs || 0)) return data.state
  return null
}
