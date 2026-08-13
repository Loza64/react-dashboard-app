import { Button, Card, Divider, Input, Space, Typography } from 'antd'
import { useState } from 'react'
import {
  DEFAULT_THEME_CONFIG,
  getStoredThemeConfig,
  saveThemeConfig,
  type ThemeColorTokens,
  type ThemeConfig,
  type ThemeMode,
} from '@/config/theme'
import { useTheme } from '@/hooks/useTheme'

const colorFields: Array<{ key: keyof ThemeColorTokens; label: string }> = [
  { key: 'primaryColor', label: 'Primario' },
  { key: 'primaryStrong', label: 'Primario fuerte' },
  { key: 'primarySoft', label: 'Primario suave' },
  { key: 'secondaryColor', label: 'Secundario' },
  { key: 'bgBase', label: 'Fondo base' },
  { key: 'bgLayout', label: 'Fondo del layout' },
  { key: 'bgElevated', label: 'Fondo elevado' },
  { key: 'bgPanel', label: 'Panel' },
  { key: 'bgMuted', label: 'Muted' },
  { key: 'bgSubtle', label: 'Subtle' },
  { key: 'textBase', label: 'Texto principal' },
  { key: 'textMuted', label: 'Texto secundario' },
  { key: 'textSoft', label: 'Texto suave' },
  { key: 'borderColor', label: 'Borde' },
  { key: 'borderStrong', label: 'Borde fuerte' },
]

export default function ThemeSettingsView() {
  const { theme, updateThemeColors, resetThemeColors } = useTheme()
  const [activeMode, setActiveMode] = useState<ThemeMode>(theme)
  const [config, setConfig] = useState<ThemeConfig>(() =>
    getStoredThemeConfig()
  )

  const saveConfig = (nextConfig: ThemeConfig) => {
    setConfig(nextConfig)
    saveThemeConfig(nextConfig)
    updateThemeColors(nextConfig[activeMode], activeMode)
  }

  const handleColorChange = (key: keyof ThemeColorTokens, value: string) => {
    const nextConfig: ThemeConfig = {
      ...config,
      [activeMode]: {
        ...config[activeMode],
        [key]: value,
      },
    }

    saveConfig(nextConfig)
  }

  const handleReset = () => {
    setConfig(DEFAULT_THEME_CONFIG)
    resetThemeColors()
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Configuración del tema
            </Typography.Title>
            <Typography.Text type="secondary">
              Personaliza la paleta del dashboard y guárdala en localStorage.
            </Typography.Text>
          </div>

          <Space>
            <Button
              type={activeMode === 'light' ? 'primary' : 'default'}
              onClick={() => setActiveMode('light')}
            >
              Claro
            </Button>
            <Button
              type={activeMode === 'dark' ? 'primary' : 'default'}
              onClick={() => setActiveMode('dark')}
            >
              Oscuro
            </Button>
            <Button danger onClick={handleReset}>
              Restablecer
            </Button>
          </Space>
        </div>

        <Divider> Tema {activeMode === 'dark' ? 'oscuro' : 'claro'} </Divider>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {colorFields.map((field) => (
            <div
              key={`${activeMode}-${field.key}`}
              className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-subtle)] p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-[var(--text-base)]">
                  {field.label}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {config[activeMode][field.key]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={config[activeMode][field.key]}
                  onChange={(event) =>
                    handleColorChange(field.key, event.target.value)
                  }
                  style={{
                    width: 56,
                    minWidth: 56,
                    height: 36,
                    padding: 0,
                    borderRadius: 8,
                  }}
                />
                <Input
                  value={config[activeMode][field.key]}
                  onChange={(event) =>
                    handleColorChange(field.key, event.target.value)
                  }
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="primary" onClick={() => saveConfig(config)}>
            Guardar cambios
          </Button>
        </div>
      </Card>
    </div>
  )
}
