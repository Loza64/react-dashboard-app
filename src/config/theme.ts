export type ThemeMode = 'light' | 'dark'

export type ThemeColorTokens = {
  // Semantic colors
  primary: string
  primaryHover: string
  secondary: string

  // Background layers
  bgBase: string
  bgElevated: string
  bgContrast: string

  // Text
  textPrimary: string
  textSecondary: string

  // Borders
  border: string

  // Status colors (semantic)
  success: string
  warning: string
  error: string
  info: string
}

export type ThemeConfig = {
  light: ThemeColorTokens
  dark: ThemeColorTokens
}

export const THEME_STORAGE_KEY = 'dashboard-theme-config'

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  light: {
    // Semantic colors
    primary: '#1d4ed8',
    primaryHover: '#1e3a8a',
    secondary: '#64748b',

    // Background layers
    bgBase: '#f4f7fb',
    bgElevated: '#ffffff',
    bgContrast: '#edf2f7',

    // Text
    textPrimary: '#0f172a',
    textSecondary: '#475569',

    // Borders
    border: '#dfe7f1',

    // Status colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#1d4ed8',
  },
  dark: {
    // Semantic colors
    primary: '#8aa8ff',
    primaryHover: '#bfd1ff',
    secondary: '#a5b4cf',

    // Background layers
    bgBase: '#0b1220',
    bgElevated: '#101c2f',
    bgContrast: '#0d1728',

    // Text
    textPrimary: '#e2e8f0',
    textSecondary: '#a5b4cf',

    // Borders
    border: '#23314a',

    // Status colors
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#8aa8ff',
  },
}

const cssMapping: Record<keyof ThemeColorTokens, string> = {
  primary: '--primary',
  primaryHover: '--primary-hover',
  secondary: '--secondary',
  bgBase: '--bg-base',
  bgElevated: '--bg-elevated',
  bgContrast: '--bg-contrast',
  textPrimary: '--text-primary',
  textSecondary: '--text-secondary',
  border: '--border',
  success: '--success',
  warning: '--warning',
  error: '--error',
  info: '--info',
}

export const getStoredThemeConfig = (): ThemeConfig => {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (!raw) return DEFAULT_THEME_CONFIG

    const parsed = JSON.parse(raw) as Partial<ThemeConfig>
    if (!parsed || typeof parsed !== 'object') return DEFAULT_THEME_CONFIG

    const requiredTokens = Object.keys(DEFAULT_THEME_CONFIG.light)
    const isValid = (obj: Record<string, unknown>) =>
      requiredTokens.every((key) => typeof obj[key] === 'string' && obj[key])

    if (!isValid(parsed.light || {}) || !isValid(parsed.dark || {})) {
      console.warn('Stored theme config is invalid, using defaults')
      return DEFAULT_THEME_CONFIG
    }

    return {
      light: { ...DEFAULT_THEME_CONFIG.light, ...parsed.light },
      dark: { ...DEFAULT_THEME_CONFIG.dark, ...parsed.dark },
    }
  } catch (error) {
    console.error('Failed to parse theme config:', error)
    return DEFAULT_THEME_CONFIG
  }
}

export const saveThemeConfig = (config: ThemeConfig) => {
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config))
}

export const resetThemeConfig = () => {
  localStorage.removeItem(THEME_STORAGE_KEY)
}

export const applyThemePalette = (
  mode: ThemeMode,
  customConfig?: ThemeConfig
) => {
  const root = document.documentElement
  const palette = (customConfig ?? getStoredThemeConfig())[mode]

  Object.entries(cssMapping).forEach(([token, cssVar]) => {
    const key = token as keyof ThemeColorTokens
    root.style.setProperty(cssVar, palette[key])
  })
}

export const getThemeConfigForMode = (mode: ThemeMode): ThemeColorTokens =>
  getStoredThemeConfig()[mode]
