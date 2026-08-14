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
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.primaryHover,
      colorInfo: colors.info,
      colorSuccess: colors.success,
      colorWarning: colors.warning,
      colorError: colors.error,

      fontFamily: 'system-ui, sans-serif',

      colorBgBase: colors.bgBase,
      colorBgLayout: colors.bgContrast,

      colorText: colors.textPrimary,
      colorTextSecondary: colors.textSecondary,

      colorBorder: colors.border,
      borderRadius: baseBorderRadius,
    },

    components: {
      Input: {
        controlHeight: 40,
        borderRadius: 6,
        paddingInline: 12,
        colorBorder: colors.border,
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
        borderColor: colors.border,
      },

      Modal: {
        colorBgMask: 'rgba(15, 23, 42, 0.5)',
        colorBgElevated: colors.bgElevated,
      },

      Button: {
        borderRadius: 6,
        colorPrimary: colors.primary,
        colorPrimaryHover: colors.primaryHover,
        colorPrimaryActive: colors.primary,
        colorPrimaryBg: colors.primary,
        colorPrimaryBgHover: colors.primaryHover,
        colorPrimaryText: '#ffffff',
        colorPrimaryBorder: colors.primary,
      },

      Tooltip: {
        colorBgBase: colors.primary,
        colorText: colors.bgBase,
        borderRadius: 6,
        padding: 8,
      },
    },
  }
}

export const antd = getAntdTheme('light')
