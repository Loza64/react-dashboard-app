import type { ThemeConfig } from 'antd';

const baseBG = '#ffffff';
const layoutBG = '#ffffff';

const primaryColor = '#ea580c';    // orange-600
const primaryHover = '#f97316';    // orange-500
const secondaryColor = '#fb923c';  // orange-400

const textBase = '#1f2937';
const borderColor = '#e5e7eb';

export const baseBorderRadius = 6;

export const antd: ThemeConfig = {
  token: {
    colorPrimary: primaryColor,
    colorPrimaryHover: primaryHover,
    colorInfo: primaryColor,
    colorSuccess: primaryColor,
    colorWarning: primaryColor,
    colorError: primaryColor,

    // 📝 Tipografía
    fontFamily: 'system-ui, sans-serif',

    // 🎨 Fondos
    colorBgBase: baseBG,
    colorBgLayout: layoutBG,

    // 🔤 Texto
    colorText: textBase,
    colorTextSecondary: secondaryColor,

    // 🟦 Bordes
    colorBorder: borderColor,
    borderRadius: baseBorderRadius,
  },

  // 🎚 Componentes personalizados
  components: {
    Input: {
      controlHeight: 40,
      borderRadius: 6,
      paddingInline: 12,
      colorBorder: borderColor
    },

    InputNumber: {
      controlHeight: 40,
      paddingInline: 12
    },

    Select: {
      controlHeight: 40
    },

    Table: {
      borderRadius: 6,
      borderColor: borderColor
    },

    Modal: {
      colorBgMask: 'rgba(0,0,0,0.45)',
      colorBgElevated: '#ffffff',
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
    }
  },
};
