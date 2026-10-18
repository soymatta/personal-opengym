// Runtime platform flags. openGym is a plain web app (installable PWA) — there is no
// backend, no native shell and no login, so this is only about tailoring the UI copy to
// the device the browser happens to be running on.
export const IS_ANDROID = /Android/.test(navigator.userAgent)
