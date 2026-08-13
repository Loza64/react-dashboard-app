import { theme as antdTheme, type ThemeConfig } from 'antd'
import type { ThemeMode } from '@/hooks/useTheme'

const primaryColor = '#000049'
const primaryHover = '#002a4f'
const secondaryColor = '#002a4f'

export const baseBorderRadius = 6

const palette = {
  light: {
    baseBG: '#ffffff',
    layoutBG: '#ffffff',
    textBase: '#1f2937',
    borderColor: '#e5e7eb',
    modalBG: '#ffffff',
    maskBG: 'rgba(0,0,0,0.45)',
  },
  dark: {
    baseBG: '#141414',
    layoutBG: '#101010',
    textBase: '#e5e7eb',
    borderColor: '#303030',
    modalBG: '#1f1f1f',
    maskBG: 'rgba(0,0,0,0.65)',
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
