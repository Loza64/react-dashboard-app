import { useCallback, useEffect } from 'react'
import { themeRecoil } from '@/constants/recoil'
import {
  applyThemePalette,
  DEFAULT_THEME_CONFIG,
  getStoredThemeConfig,
  saveThemeConfig,
  type ThemeColorTokens,
  type ThemeConfig,
  type ThemeMode,
} from '@/config/theme'
import useRecoilStorage from './core/useRecoilStorage'

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
    const config = getStoredThemeConfig()
    const palette = config[mode]

    root.classList.toggle('dark', mode === 'dark')
    root.style.colorScheme = mode

    Object.entries({
      '--primary-color': palette.primaryColor,
      '--primary-strong': palette.primaryStrong,
      '--primary-soft': palette.primarySoft,
      '--secondary-color': palette.secondaryColor,
      '--bg-base': palette.bgBase,
      '--bg-layout': palette.bgLayout,
      '--bg-elevated': palette.bgElevated,
      '--bg-panel': palette.bgPanel,
      '--bg-muted': palette.bgMuted,
      '--bg-subtle': palette.bgSubtle,
      '--text-base': palette.textBase,
      '--text-muted': palette.textMuted,
      '--text-soft': palette.textSoft,
      '--border-color': palette.borderColor,
      '--border-strong': palette.borderStrong,
    }).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
  }, [mode])

  const toggleTheme = useCallback(() => {
    setTheme((previous) => (previous === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  const updateThemeColors = useCallback(
    (nextPalette: Partial<ThemeColorTokens>, targetMode: ThemeMode = mode) => {
      const currentConfig = getStoredThemeConfig()
      const mergedConfig: ThemeConfig = {
        light: {
          ...currentConfig.light,
          ...(targetMode === 'light' ? nextPalette : {}),
        },
        dark: {
          ...currentConfig.dark,
          ...(targetMode === 'dark' ? nextPalette : {}),
        },
      }

      saveThemeConfig(mergedConfig)
      applyThemePalette(mode, mergedConfig)
    },
    [mode]
  )

  const resetThemeColors = useCallback(() => {
    saveThemeConfig(DEFAULT_THEME_CONFIG)
    applyThemePalette(mode, DEFAULT_THEME_CONFIG)
  }, [mode])

  return {
    theme: mode,
    setTheme,
    toggleTheme,
    updateThemeColors,
    resetThemeColors,
    themeConfig: getStoredThemeConfig(),
  }
}
