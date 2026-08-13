import { theme as antdTheme, type ThemeConfig } from 'antd'
import type { ThemeMode } from '@/config/theme'
import { getThemeConfigForMode } from '@/config/theme'

export const baseBorderRadius = 6

export const getAntdTheme = (mode: ThemeMode): ThemeConfig => {
  const colors = getThemeConfigForMode(mode)

  return {
    algorithm:
      mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: colors.primaryColor,
      colorPrimaryHover: colors.primaryStrong,
      colorInfo: colors.primaryColor,
      colorSuccess: colors.primaryColor,
      colorWarning: colors.primaryColor,
      colorError: '#ef4444',

      fontFamily: 'system-ui, sans-serif',

      colorBgBase: colors.bgBase,
      colorBgLayout: colors.bgLayout,

      colorText: colors.textBase,
      colorTextSecondary: colors.textMuted,

      colorBorder: colors.borderColor,
      borderRadius: baseBorderRadius,
    },

    components: {
      Input: {
        controlHeight: 40,
        borderRadius: 6,
        paddingInline: 12,
        colorBorder: colors.borderColor,
      },

      InputNumber: {
        controlHeight: 40,
        paddingInline: 12,
      },

      Select: {
        controlHeight: 40,
      },

      Table: {
        borderRadius: 6,
        borderColor: colors.borderColor,
      },

      Modal: {
        colorBgMask: 'rgba(15, 23, 42, 0.5)',
        colorBgElevated: colors.bgElevated,
      },

      Button: {
        borderRadius: 6,
        colorPrimaryHover: colors.primaryStrong,
        colorPrimaryActive: colors.primaryColor,
      },

      Tooltip: {
        colorBgBase: colors.primaryColor,
        colorText: '#ffffff',
        borderRadius: 6,
        padding: 8,
      },
    },
  }
}

export const antd = getAntdTheme('light')
