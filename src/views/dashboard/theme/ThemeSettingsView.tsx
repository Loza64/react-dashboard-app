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
  { key: 'primary', label: 'Color Primario' },
  { key: 'primaryHover', label: 'Primario (Hover)' },
  { key: 'secondary', label: 'Color Secundario' },
  { key: 'bgBase', label: 'Fondo Base' },
  { key: 'bgElevated', label: 'Fondo Elevado' },
  { key: 'bgContrast', label: 'Fondo Contraste' },
  { key: 'textPrimary', label: 'Texto Principal' },
  { key: 'textSecondary', label: 'Texto Secundario' },
  { key: 'border', label: 'Borde' },
  { key: 'success', label: 'Éxito' },
  { key: 'warning', label: 'Advertencia' },
  { key: 'error', label: 'Error' },
  { key: 'info', label: 'Información' },
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
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-contrast)] p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {field.label}
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
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
