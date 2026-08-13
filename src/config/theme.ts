export type ThemeMode = 'light' | 'dark'

export type ThemeColorTokens = {
  primaryColor: string
  primaryStrong: string
  primarySoft: string
  secondaryColor: string

  bgBase: string
  bgLayout: string
  bgElevated: string
  bgPanel: string
  bgMuted: string
  bgSubtle: string

  textBase: string
  textMuted: string
  textSoft: string

  borderColor: string
  borderStrong: string
}

export type ThemeConfig = {
  light: ThemeColorTokens
  dark: ThemeColorTokens
}

export const THEME_STORAGE_KEY = 'dashboard-theme-config'

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  light: {
    primaryColor: '#1d4ed8',
    primaryStrong: '#1e3a8a',
    primarySoft: '#dbeafe',
    secondaryColor: '#0f172a',
    bgBase: '#f4f7fb',
    bgLayout: '#edf2f7',
    bgElevated: '#ffffff',
    bgPanel: '#ffffff',
    bgMuted: '#e8eef8',
    bgSubtle: '#f8fafc',
    textBase: '#0f172a',
    textMuted: '#475569',
    textSoft: '#64748b',
    borderColor: '#dfe7f1',
    borderStrong: '#c7d2e0',
  },
  dark: {
    primaryColor: '#8aa8ff',
    primaryStrong: '#bfd1ff',
    primarySoft: 'rgba(138, 168, 255, 0.18)',
    secondaryColor: '#c9d9ff',
    bgBase: '#0b1220',
    bgLayout: '#0d1728',
    bgElevated: '#101c2f',
    bgPanel: '#132238',
    bgMuted: '#1a2940',
    bgSubtle: '#0f1b2d',
    textBase: '#e2e8f0',
    textMuted: '#a5b4cf',
    textSoft: '#8aa0c2',
    borderColor: '#23314a',
    borderStrong: '#2f4467',
  },
}

const cssMapping: Record<keyof ThemeColorTokens, string> = {
  primaryColor: '--primary-color',
  primaryStrong: '--primary-strong',
  primarySoft: '--primary-soft',
  secondaryColor: '--secondary-color',
  bgBase: '--bg-base',
  bgLayout: '--bg-layout',
  bgElevated: '--bg-elevated',
  bgPanel: '--bg-panel',
  bgMuted: '--bg-muted',
  bgSubtle: '--bg-subtle',
  textBase: '--text-base',
  textMuted: '--text-muted',
  textSoft: '--text-soft',
  borderColor: '--border-color',
  borderStrong: '--border-strong',
}

export const getStoredThemeConfig = (): ThemeConfig => {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (!raw) return DEFAULT_THEME_CONFIG

    const parsed = JSON.parse(raw) as Partial<ThemeConfig>
    if (!parsed || typeof parsed !== 'object') return DEFAULT_THEME_CONFIG

    return {
      light: { ...DEFAULT_THEME_CONFIG.light, ...parsed.light },
      dark: { ...DEFAULT_THEME_CONFIG.dark, ...parsed.dark },
    }
  } catch {
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
