import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { readString, writeString } from '@/utils/storage'

const THEME_KEY = 'sairna-theme'
const THEME_COLORS = { light: '#0d3043', dark: '#091c27' }

const ThemeContext = createContext(null)

function initialTheme() {
  const saved = readString(THEME_KEY)
  return saved === 'dark' ? 'dark' : 'light'
}

/** Provides `theme` ('light' | 'dark') and `toggleTheme()`; persists to localStorage. */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
    writeString(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), [])
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
