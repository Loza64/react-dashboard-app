import { useCallback, useEffect } from 'react'
import { themeRecoil } from '@/constants/recoil'
import useRecoilStorage from './core/useRecoilStorage'

export type ThemeMode = 'light' | 'dark'

const getSystemPreference = (): ThemeMode =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

export function useTheme() {
  const [theme, setTheme] = useRecoilStorage<ThemeMode>(
    themeRecoil,
    getSystemPreference()
  )

  const mode = theme ?? 'light'

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
    root.style.colorScheme = mode
  }, [mode])

  const toggleTheme = useCallback(() => {
    setTheme((previous) => (previous === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  return { theme: mode, setTheme, toggleTheme }
}
