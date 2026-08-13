import { Loader2, Menu as MenuIcon, Moon, Search, Sun } from 'lucide-react'
import type React from 'react'
import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardMenu from './menu'
import { useMenuVisibility } from './menu/useMenuVisibility'
import { useSession } from '@/hooks/useSession'
import ForbiddenView from '@/views/ForbiddenView'
import { searchRecoil } from '@/constants/recoil'
import type { RouteConfig } from '@/config/routes.app'
import { isAuthorized } from '@/utils/permission.app'
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

  const { profile: user, loading } = useSession()
  const location = useLocation()

  const currentPath = location.pathname
  const role = user?.role?.name

  const allowed = useMemo(
    () => (role ? isAuthorized(role, currentPath) : false),
    [role, currentPath]
  )

  useEffect(() => {
    setSearch('')
  }, [currentPath, setSearch])

  if (loading.profile) {
    return (
      <div className="bg-layout flex h-screen items-center justify-center">
        <Loader2 className="text-primary animate-spin" size={32} />
      </div>
    )
  }

  if (!allowed) return <ForbiddenView />

  return (
    <div className="bg-layout flex min-h-screen w-full">
      <DashboardMenu open={menuOpen} onClose={closeMenu} />

      <div className="bg-app flex min-h-screen w-full min-w-0 flex-1 flex-col overflow-hidden transition-all duration-200 ease-in-out">
        <div className="border-default bg-surface/90 flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur-sm sm:gap-4 sm:px-9 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="border-default bg-surface hover:bg-muted flex shrink-0 items-center justify-center rounded-full border p-2 shadow-sm transition-colors"
            >
              <MenuIcon size={18} className="text-[var(--text-base)]" />
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
                  className="pointer-events-none absolute left-3 text-[var(--primary-color)]"
                />
                <input
                  placeholder="Buscar"
                  value={search ?? ''}
                  onChange={(event) => setSearch(event.target.value)}
                  className="border-default bg-surface w-full max-w-80 rounded-lg border py-2 pr-3 pl-9 text-sm text-[var(--text-base)] transition-colors outline-none placeholder:text-[var(--text-soft)] focus:border-[var(--primary-color)]"
                />
              </div>
            )}

            <button
              onClick={toggleTheme}
              aria-label="Cambiar tema"
              className="border-default bg-surface hover:bg-muted flex items-center justify-center rounded-full border p-2 text-[var(--text-base)] shadow-sm transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--primary-color)] bg-[var(--primary-soft)] text-sm font-semibold text-[var(--primary-strong)]">
              {(user?.username?.[0] ?? '?').toUpperCase()}
            </div>
          </div>
        </div>

        {routeData.search && (
          <div className="relative flex items-center px-4 pb-3 sm:hidden">
            <Search
              size={16}
              className="pointer-events-none absolute left-7 text-[var(--primary-color)]"
            />
            <input
              placeholder="Buscar"
              value={search ?? ''}
              onChange={(event) => setSearch(event.target.value)}
              className="border-default bg-surface w-full rounded-lg border py-2 pr-3 pl-9 text-sm text-[var(--text-base)] transition-colors outline-none placeholder:text-[var(--text-soft)] focus:border-[var(--primary-color)]"
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
