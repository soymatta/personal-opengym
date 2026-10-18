// Web / PWA build.
//
// openGym ships as a single installable PWA (Android, iOS and desktop browsers) with no
// native shell and no backend. Everything lives in localStorage; a backup is a JSON file
// the user downloads. `MOBILE` is kept for the handful of views that still branch on it,
// but it is always false now — the Capacitor app is gone, and with it the native
// load/save/reminder shims that used to back those branches.

export const MOBILE = false

// Share a JSON string as a file. Uses the Web Share API (Android/iOS, and some desktop
// browsers) when it can share files, and falls back to a normal download otherwise.
export async function shareExport(text, filename) {
  const file = new File([text], filename, { type: 'application/json' })
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: filename }); return } catch (e) { /* share dismissed */ }
  }
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}
