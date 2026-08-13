import { theme as antdTheme, type ThemeConfig } from 'antd'
import type { ThemeMode } from '@/hooks/useTheme'

const primaryColor = '#1d4ed8'
const primaryHover = '#2563eb'
const secondaryColor = '#0f172a'

export const baseBorderRadius = 6

const palette = {
  light: {
    baseBG: '#f4f7fb',
    layoutBG: '#edf2f7',
    textBase: '#0f172a',
    borderColor: '#dfe7f1',
    modalBG: '#ffffff',
    maskBG: 'rgba(15, 23, 42, 0.5)',
  },
  dark: {
    baseBG: '#0b1220',
    layoutBG: '#0d1728',
    textBase: '#e2e8f0',
    borderColor: '#23314a',
    modalBG: '#101c2f',
    maskBG: 'rgba(2, 6, 23, 0.72)',
  },
}

export const getAntdTheme = (mode: ThemeMode): ThemeConfig => {
  const colors = palette[mode]

  return {
    algorithm:
      mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: primaryColor,
      colorPrimaryHover: primaryHover,
      colorInfo: primaryColor,
      colorSuccess: primaryColor,
      colorWarning: primaryColor,
      colorError: 'red',

      fontFamily: 'system-ui, sans-serif',

      colorBgBase: colors.baseBG,
      colorBgLayout: colors.layoutBG,

      colorText: colors.textBase,
      colorTextSecondary: secondaryColor,

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
        colorBgMask: colors.maskBG,
        colorBgElevated: colors.modalBG,
      },

      Button: {
        borderRadius: 6,
        colorPrimaryHover: primaryHover,
        colorPrimaryActive: primaryColor,
      },

      Tooltip: {
        colorBgBase: primaryColor,
        colorText: '#ffffff',
        borderRadius: 6,
        padding: 8,
      },
    },
  }
}

// Export por compatibilidad (tema claro por defecto)
export const antd = getAntdTheme('light')
