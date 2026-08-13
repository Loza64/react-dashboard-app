import { Loader2, Menu as MenuIcon, Moon, Search, Sun } from 'lucide-react'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardMenu from './DashboardMenu'
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
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

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

  useEffect(() => {
    queueMicrotask(() => setMobileOpen(false))
  }, [currentPath])

  if (loading.profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-neutral-900">
        <Loader2 className="text-primary animate-spin" size={32} />
      </div>
    )
  }

  if (!allowed) return <ForbiddenView />

  return (
    <div className="flex min-h-screen w-full">
      <DashboardMenu
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((previous) => !previous)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-h-screen w-full min-w-0 flex-1 flex-col overflow-hidden bg-white transition-all duration-200 ease-in-out dark:bg-neutral-900">
        <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-9 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
              className="flex shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white p-2 shadow-sm transition-colors hover:bg-gray-50 lg:hidden dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            >
              <MenuIcon size={18} />
            </button>

            <div className="text-primary flex min-w-0 flex-col">
              <span className="truncate text-xl font-extrabold sm:text-3xl">
                {routeData.title}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {routeData.search && (
              <div className="relative hidden items-center sm:flex dark:border-neutral-700 dark:bg-neutral-800">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 text-blue-500"
                />
                <input
                  placeholder="Buscar"
                  value={search ?? ''}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full max-w-80 rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm outline-none focus:border-blue-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
                />
              </div>
            )}

            <button
              onClick={toggleTheme}
              aria-label="Cambiar tema"
              className="text-primary flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 shadow-sm transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="border-primary flex size-9 shrink-0 items-center justify-center rounded-full border-2 bg-blue-100 text-sm font-semibold text-blue-600">
              {(user?.username?.[0] ?? '?').toUpperCase()}
            </div>
          </div>
        </div>

        {routeData.search && (
          <div className="relative flex items-center px-4 pb-3 sm:hidden dark:border-neutral-700 dark:bg-neutral-800">
            <Search
              size={16}
              className="pointer-events-none absolute left-7 text-blue-500"
            />
            <input
              placeholder="Buscar"
              value={search ?? ''}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm outline-none focus:border-blue-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
            />
          </div>
        )}

        <div className="scrollbar-hide h-[calc(100dvh-70px)] overflow-y-auto rounded-tl-lg bg-gray-100 p-3 transition-all duration-200 dark:bg-neutral-800">
          {children}
        </div>
      </div>
    </div>
  )
}
