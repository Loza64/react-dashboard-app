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

    // Aplicar clase dark al elemento raíz
    root.classList.toggle('dark', mode === 'dark')
    root.style.colorScheme = mode

    // Establecer todas las variables CSS basadas en el modo
    const cssVariables = {
      '--primary': palette.primary,
      '--primary-hover': palette.primaryHover,
      '--secondary': palette.secondary,
      '--bg-base': palette.bgBase,
      '--bg-elevated': palette.bgElevated,
      '--bg-contrast': palette.bgContrast,
      '--text-primary': palette.textPrimary,
      '--text-secondary': palette.textSecondary,
      '--border': palette.border,
      '--success': palette.success,
      '--warning': palette.warning,
      '--error': palette.error,
      '--info': palette.info,
    }

    Object.entries(cssVariables).forEach(([property, value]) => {
      if (value) {
        root.style.setProperty(property, value)
      }
    })

    void root.offsetHeight
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
      applyThemePalette(targetMode, mergedConfig)
    },
    [mode]
  )

  const resetThemeColors = useCallback(
    (targetMode: ThemeMode = mode) => {
      saveThemeConfig(DEFAULT_THEME_CONFIG)
      applyThemePalette(targetMode, DEFAULT_THEME_CONFIG)
    },
    [mode]
  )

  return {
    theme: mode,
    setTheme,
    toggleTheme,
    updateThemeColors,
    resetThemeColors,
    themeConfig: getStoredThemeConfig(),
  }
}
