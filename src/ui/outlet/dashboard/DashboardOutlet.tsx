import { Menu as MenuIcon, Moon, Search, Sun } from 'lucide-react'
import type React from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardMenu from './menu'
import { useMenuVisibility } from './menu/useMenuVisibility'
import { useSession } from '@/hooks/useSession'
import { searchRecoil } from '@/constants/recoil'
import type { RouteConfig } from '@/config/routes.app'
import useRecoilStorage from '@/hooks/core/useRecoilStorage'
import { useTheme } from '@/hooks/useTheme'

export default function DashboardOutlet({
  children,
  routeData,
}: {
  children: React.ReactNode
  routeData: RouteConfig
}) {
  const [search, setSearch] = useRecoilStorage<string | undefined>(searchRecoil)
  const { theme, toggleTheme } = useTheme()
  const {
    open: menuOpen,
    toggle: toggleMenu,
    close: closeMenu,
  } = useMenuVisibility()

  const { profile: user } = useSession()
  const location = useLocation()

  const currentPath = location.pathname

  useEffect(() => {
    setSearch('')
  }, [currentPath, setSearch])

  return (
    <div className="bg-layout flex min-h-screen w-full">
      <DashboardMenu open={menuOpen} onClose={closeMenu} />

      <div className="bg-app flex min-h-screen w-full min-w-0 flex-1 flex-col overflow-hidden transition-all duration-200 ease-in-out">
        <div className="border-default bg-surface/90 flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur-sm sm:gap-4 sm:px-9 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="border-default bg-surface flex shrink-0 items-center justify-center rounded-full border p-2 shadow-sm transition-colors hover:bg-(--bg-contrast)"
            >
              <MenuIcon size={18} className="text-(--text-primary)" />
            </button>

            <div className="text-primary flex min-w-0 flex-col">
              <span className="truncate text-xl font-extrabold sm:text-3xl">
                {routeData.title}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {routeData.search && (
              <div className="relative hidden items-center sm:flex">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 text-(--primary)"
                />
                <input
                  placeholder="Buscar"
                  value={search ?? ''}
                  onChange={(event) => setSearch(event.target.value)}
                  className="border-default bg-surface w-full max-w-80 rounded-lg border py-2 pr-3 pl-9 text-sm text-(--text-primary) transition-colors outline-none placeholder:text-(--text-secondary) focus:border-(--primary)"
                />
              </div>
            )}

            <button
              onClick={toggleTheme}
              aria-label="Cambiar tema"
              className="border-default bg-surface flex items-center justify-center rounded-full border p-2 text-(--text-primary) shadow-sm transition-colors hover:bg-(--bg-contrast)"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-(--primary) bg-(--primary)/10 text-sm font-semibold text-(--primary)">
              {(user?.username?.[0] ?? '?').toUpperCase()}
            </div>
          </div>
        </div>

        {routeData.search && (
          <div className="relative flex items-center px-4 pb-3 sm:hidden">
            <Search
              size={16}
              className="pointer-events-none absolute left-7 text-(--primary)"
            />
            <input
              placeholder="Buscar"
              value={search ?? ''}
              onChange={(event) => setSearch(event.target.value)}
              className="border-default bg-surface w-full rounded-lg border py-2 pr-3 pl-9 text-sm text-(--text-primary) transition-colors outline-none placeholder:text-(--text-secondary) focus:border-(--primary)"
            />
          </div>
        )}

        <div className="scrollbar-hide bg-layout h-[calc(100dvh-70px)] overflow-y-auto rounded-tl-lg p-3 transition-all duration-200">
          {children}
        </div>
      </div>
    </div>
  )
}
