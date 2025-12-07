import type { ThemeConfig } from 'antd'

const baseBG = '#ffffff'
const layoutBG = '#ffffff'
const primaryColor = '#4478B9'
const secondaryColor = '#595959'


export const baseBorderRadius = 6

export const antd: ThemeConfig = {
  token: {
    colorPrimary: primaryColor,
    borderRadius: baseBorderRadius,
    fontFamily: 'system-ui, sans-serif',
    colorBgBase: baseBG,
    colorBgLayout: layoutBG,
    colorTextSecondary: secondaryColor,
  },
  components: {
    Input: { controlHeight: 40, borderRadius: 6, paddingInline: 12 },
    InputNumber: { controlHeight: 40, paddingInline: 12 },
    Select: { controlHeight: 40 },
    Table: { borderRadius: 6 },
    Modal: {
      colorBgMask: 'rgba(0,0,0,0.45)',
      colorBgElevated: '#ffffff',
    },
    Button: { borderRadius: 6 },
  },
}
