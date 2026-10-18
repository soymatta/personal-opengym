# personal-opengym en Vercel + Supabase

WebApp lista para llevar tu progreso en todos tus dispositivos. La app es 100% estática (no hay
backend): Supabase es solo el espejo en la nube del mismo documento JSON que vive en el navegador.

## 1. Supabase (5 min, una vez)

1. Crea proyecto en https://supabase.com (free tier vale).
2. Abre **SQL Editor** y pega `supabase/schema.sql` de este repo → **Run**.
   Crea `public.gym_states (user_id uuid PK, state jsonb, updated_at timestamptz)` con RLS: cada usuario solo ve su fila.
3. **Authentication > Providers > Email**: activado. Desactiva "Confirm email" si quieres entrar directo.
4. Copia **Project URL** y **anon public key** (Settings > API).

## 2. Vercel (2 min)

Opción recomendada — Root Directory `frontend`:

1. Vercel > **Add New Project** > importa `soymatta/personal-opengym`.
2. **Root Directory**: `frontend` (solo se despliega el frontend estático).
3. **Environment Variables**:
   - `VITE_SUPABASE_URL` = tu Project URL
   - `VITE_SUPABASE_ANON_KEY` = tu anon key
   - `VITE_IMG_BASE` = `https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@7455efae41b330c265e7cd4b78dfa848e7ce5ebd/images/`
   - `VITE_GIF_BASE` = `https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@7455efae41b330c265e7cd4b78dfa848e7ce5ebd/videos/`
4. **Deploy**. La app usa HashRouter, no necesita rewrites.

La configuración vive en `frontend/vercel.json` (framework `vite`, `npm ci` + `npm run build`,
salida `dist`) y **Node 22** está fijado en `frontend/.nvmrc`: `vite 8` exige
`^20.19.0 || >=22.12.0`, así que un proyecto con Node 18 falla el build aunque el código esté bien.

Alternativa monorepo (Root Directory `/`): entonces manda el `vercel.json` de la raíz, que apunta
a `frontend/dist`, más el `.nvmrc` de la raíz; solo añade las mismas env vars. **No mezcles las
dos**: con Root Directory `frontend`, el `vercel.json` de la raíz se ignora, y si llegara a
leerse sus órdenes `cd frontend && …` fallarían al ejecutarse ya dentro de `frontend/`.

## 3. Uso en cada dispositivo

1. Abre tu URL de Vercel → **Settings > Cloud sync (Supabase)**.
2. **Create account** con el mismo email en todos tus dispositivos (o Sign in).
3. Entrena normal: cada cambio se sube solo (~1.5 s debounce) y al abrir otro dispositivo hace pull si la nube es más nueva (por `_ts`).
4. Sin internet sigue funcionando en local; al volver sincroniza.

## Cómo funciona

|  | Local (por defecto) | + Supabase (opcional) |
|---|---|---|
| Account | ninguno | email + password (Supabase Auth) |
| Datos | `localStorage` (`gym_state_v1`) | espejo en `gym_states.state` (jsonb, RLS por usuario) |
| Sync | — | `sbPush` / `sbPull` en `lib/supabase.js` |
| Media | `/img` `/gif` locales o CDN jsdelivr vía `VITE_IMG_BASE` | igual |
| Export | backup JSON + export AI (JSON/NDJSON) | igual |

Sin `VITE_SUPABASE_*` la app es local-only (todo en el navegador + Export backup JSON). No hay
login, ni passkeys, ni push, ni AI Coach.

## Funciones nuevas en este fork

- **Export AI (JSON)**: Settings > Data > Export for AI (JSON). Un documento con perfil, rutinas,
  semana y todo el historial aplanado a **una fila por serie** (fecha, ejercicio, nº de serie,
  peso, reps/segundos, RIR/RPE, volumen, PR) + `schema` autodescriptivo. Se puede reimportar sin
  pérdida (lleva el `state` completo).
- **Export AI (NDJSON)**: la misma historia, un objeto por línea — lo más cómodo de pegar en un chat.
- **Export por ejercicio**: Stats > Exercise progress > CSV/JSON, o Settings > Data > Export by exercise. Una fila por serie (`date,workout,set,w,r,sec,min,speed,rir,rpe,vol,pr`).
- **Export por día**: abre cualquier workout en History (botones Day CSV/JSON) o Settings > Data > Export by day.
- **Full history**: Stats > Full history — todas las series de un ejercicio con fecha y 🏆 donde hubo PR.
- **Records**: tarjeta en Stats con mejor set por ejercicio (top 8 por nº de sets).
- **Volumen**: 4ª métrica en Exercise progress (suma w×r por sesión) vía `exerciseVolumeSeries()`.
- **Rutinas**: plan file JSON (`lib/plan-share.js`) + PDF + import FitNotes/Strong/Hevy/Apple Health (`lib/import-csv.js`).
