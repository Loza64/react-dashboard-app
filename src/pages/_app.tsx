import { Outlet } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import SessionProvider from '@/context/providers/SessionProvider'
import { ThemeProvider } from '@/context/providers/ThemeProvider'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/Button'

/**
 * Layout raíz: envuelve TODAS las rutas (generouted lo detecta automáticamente
 * por el nombre `_app.tsx`). Aquí viven los providers que necesitan contexto
 * de router (SessionProvider usa useNavigate/useLocation) y el botón
 * flotante de tema, equivalente al `app.html` de Angular.
 */
function AppShell() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <Outlet />

      <Button
        variant="icon"
        className="fixed right-5 bottom-5 z-[200] shadow-[0_8px_20px_rgba(15,18,25,0.15)]"
        tooltip={
          theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
        }
        onClick={toggleTheme}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </Button>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <AppShell />
      </SessionProvider>
    </ThemeProvider>
  )
}
