import { ChevronLeft, ChevronRight, Loader2, LogOut, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { menu, selectMenuKeys } from '@/config/menu'
import { searchRecoil } from '@/constants/recoil'
import type { RoleName } from '@/enum/role'
import useRecoilStorage from '@/hooks/core/useRecoilStorage'
import { useSession } from '@/hooks/useSession'
import type { MenuItem } from '@/models/app/menu'

const isAuthorized = (item: MenuItem, role: RoleName) =>
  item.authorized.includes(role) || item.authorized.includes('*')

function NavItem({
  item,
  role,
  collapsed,
  selectedKeys,
  onNavigate,
  depth = 0,
}: {
  item: MenuItem
  role: RoleName
  collapsed: boolean
  selectedKeys: string[]
  onNavigate: (key: string) => void
  depth?: number
}) {
  const children = item.children?.filter(
    (child) => isAuthorized(child, role) && child.view !== false
  )
  const hasVisibleChildren = !!children?.length
  const authorized = isAuthorized(item, role) && item.view !== false

  if (!authorized && !hasVisibleChildren) return null

  const active = selectedKeys.includes(item.key)

  return (
    <div>
      <button
        onClick={() => onNavigate(item.key)}
        title={collapsed ? item.label : undefined}
        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-extrabold transition-colors ${
          depth > 0 ? 'pl-8' : ''
        } ${collapsed ? 'justify-center px-0' : ''} ${
          active
            ? 'bg-primary text-white!'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-800'
        }`}
      >
        {item.icon && (
          <span
            className={`flex items-center justify-center ${
              active ? 'text-white' : 'text-black dark:text-gray-200'
            }`}
          >
            {item.icon}
          </span>
        )}
        {!collapsed && <span className="truncate">{item.label}</span>}
      </button>

      {hasVisibleChildren && !collapsed && (
        <div className="mt-1 flex flex-col gap-1">
          {children!.map((child) => (
            <NavItem
              key={child.key}
              item={child}
              role={role}
              collapsed={collapsed}
              selectedKeys={selectedKeys}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function MenuList({
  role,
  collapsed,
  selectedKeys,
  onNavigate,
}: {
  role: RoleName
  collapsed: boolean
  selectedKeys: string[]
  onNavigate: (key: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      {menu.map((item) => (
        <NavItem
          key={item.key}
          item={item}
          role={role}
          collapsed={collapsed}
          selectedKeys={selectedKeys}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  )
}

function ProfileBlock({
  collapsed,
  username,
  role,
  loadingProfile,
}: {
  collapsed: boolean
  username?: string
  role?: string
  loadingProfile: boolean
}) {
  return (
    <div
      className={`flex items-center gap-3 p-4 transition-all duration-300 ${
        collapsed ? 'justify-center' : ''
      }`}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
        {loadingProfile ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          (username?.[0] ?? '?').toUpperCase()
        )}
      </div>

      {!collapsed && (
        <div className="flex min-w-0 flex-col overflow-hidden">
          <span
            title={username || 'Unknown'}
            className="truncate text-sm leading-tight font-medium text-gray-800 dark:text-gray-200"
          >
            {loadingProfile ? 'Cargando...' : (username ?? 'Unknown')}
          </span>

          <span
            className={`mt-1 w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
              role
                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
            }`}
          >
            {role?.toLocaleLowerCase() || 'unknown'}
          </span>
        </div>
      )}
    </div>
  )
}

export default function DashboardMenu({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}) {
  const [, setSearch] = useRecoilStorage<string | undefined>(searchRecoil)
  const { profile, loading, logout } = useSession()
  const navigate = useNavigate()
  const location = useLocation()

  const role = profile?.role?.name
  const [closingSession, setClosingSession] = useState(false)

  const selectedKeys = useMemo(
    () => selectMenuKeys(location.pathname),
    [location.pathname]
  )

  const handleLogout = async () => {
    try {
      setClosingSession(true)
      await logout()
    } finally {
      setClosingSession(false)
    }
  }

  const handleNavigate = (key: string) => {
    setSearch('')
    if (key === location.pathname) return
    navigate(key)
  }

  return (
    <>
      {/* Sidebar de escritorio */}
      <aside className="relative hidden h-dvh shrink-0 lg:flex">
        <div
          className={`flex h-dvh flex-col border-r border-gray-100 bg-white transition-all duration-300 ease-out dark:border-neutral-800 dark:bg-neutral-900 ${
            collapsed ? 'w-20' : 'w-64'
          }`}
        >
          <ProfileBlock
            collapsed={collapsed}
            username={profile?.username}
            role={role}
            loadingProfile={loading.profile}
          />

          <div className="scrollbar-hide flex-1 overflow-y-auto px-2">
            <MenuList
              role={role!}
              collapsed={collapsed}
              selectedKeys={selectedKeys}
              onNavigate={handleNavigate}
            />
          </div>

          <div className="p-3">
            <button
              onClick={handleLogout}
              disabled={closingSession}
              title={collapsed ? 'Cerrar sesión' : undefined}
              className={`flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-900/20 ${
                collapsed ? 'px-0' : ''
              }`}
            >
              {closingSession ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <LogOut size={16} />
              )}
              {!collapsed && 'Cerrar sesión'}
            </button>
          </div>
        </div>

        <div className="absolute top-5 right-0 z-50 hidden translate-x-1/2 xl:block">
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            className="text-primary flex items-center justify-center rounded-full bg-white p-1.5 shadow-md transition-transform duration-150 hover:bg-gray-50 active:scale-95 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          >
            {collapsed ? (
              <ChevronRight size={15} strokeWidth={3} />
            ) : (
              <ChevronLeft size={15} strokeWidth={3} />
            )}
          </button>
        </div>
      </aside>

      {/* Drawer móvil */}
      <div
        className={`fixed inset-0 z-4000 bg-black/40 transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={onCloseMobile}
      />

      <div
        className={`fixed top-0 left-0 z-5000 flex h-dvh w-72 max-w-[85vw] flex-col border-r border-gray-100 bg-white shadow-xl transition-transform duration-300 ease-out lg:hidden dark:border-neutral-800 dark:bg-neutral-900 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-2 dark:border-neutral-800">
          <ProfileBlock
            collapsed={false}
            username={profile?.username}
            role={role}
            loadingProfile={loading.profile}
          />

          <button
            onClick={onCloseMobile}
            aria-label="Cerrar menú"
            className="mr-2 flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="scrollbar-hide flex-1 overflow-y-auto p-2">
          <MenuList
            role={role!}
            collapsed={false}
            selectedKeys={selectedKeys}
            onNavigate={handleNavigate}
          />
        </div>

        <div className="p-3">
          <button
            onClick={handleLogout}
            disabled={closingSession}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-900/20"
          >
            {closingSession ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <LogOut size={16} />
            )}
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  )
}
