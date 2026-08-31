export type Theme = 'light' | 'dark'

const KEY = 'crave.theme'

/**
 * Light or dark.
 *
 * Starts from the phone's own setting, then remembers whatever you pick.
 * Applied as `data-theme` on <html> rather than a class, so the CSS only
 * needs one selector and there's no flash of the wrong palette between the
 * stylesheet loading and React mounting.
 */
export function loadTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* private mode - fall through to the system preference */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* the toggle still works for this session */
  }
}

/**
 * Puts the theme on <html> and keeps the browser chrome in step — without
 * updating theme-color the phone's status bar stays the light colour and
 * the top of the screen looks broken in dark mode.
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#302e35' : '#f2685c')
}
