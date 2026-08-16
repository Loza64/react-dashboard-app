import { useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'
import { RequireAuth } from '@/components/guards/RequireAuth'
import { useSession } from '@/hooks/useSession'
import { DASHBOARD_MENU } from '@/config/dashboardMenu'
import { RoutesEnum } from '@/enum/routes..app'
import { cn } from '@/lib/utils'

function DashboardLayout() {
  const { profile, logout } = useSession()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pageTitle = useMemo(() => {
    const active = DASHBOARD_MENU.find((item) =>
      location.pathname.includes(item.route)
    )
    return active?.label ?? 'Dashboard'
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate(RoutesEnum.LOGIN)
  }

  return (
    <div className="grid h-dvh grid-cols-[240px_1fr] max-[900px]:grid-cols-1">
      <aside
        className={cn(
          'flex flex-col overflow-y-auto bg-[var(--sidebar-bg)] px-3 py-4 text-[var(--sidebar-text)]',
          'max-[900px]:fixed max-[900px]:inset-y-0 max-[900px]:left-0 max-[900px]:z-[60] max-[900px]:w-[260px] max-[900px]:max-w-[75%]',
          'max-[900px]:shadow-[4px_0_24px_rgba(0,0,0,0.2)] max-[900px]:transition-transform max-[900px]:duration-200',
          sidebarOpen
            ? 'max-[900px]:translate-x-0'
            : 'max-[900px]:-translate-x-full'
        )}
      >
        <div className="flex items-center gap-2.5 px-2 pt-2 pb-5">
          <span className="inline-flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary)] text-sm font-bold text-[var(--primary-contrast)]">
            A
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--sidebar-text-active)]">
            Admin Panel
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5">
          {DASHBOARD_MENU.map((item) => {
            const active = location.pathname.startsWith(item.route)
            const ItemIcon = item.icon
            return (
              <Link
                key={item.route}
                to={item.route}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium text-[var(--sidebar-text)] no-underline transition-colors hover:bg-white/[0.06] hover:text-[var(--sidebar-text-active)]',
                  active &&
                    'bg-[var(--primary)] text-[var(--sidebar-text-active)] hover:bg-[var(--primary)]'
                )}
              >
                <ItemIcon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          className="flex items-center gap-2.5 rounded-[var(--radius-sm)] border-none bg-transparent px-3 py-2.5 text-left text-sm font-medium text-[var(--sidebar-text)] hover:bg-white/[0.06] hover:text-[var(--sidebar-text-active)]"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-[rgba(15,18,25,0.45)] min-[901px]:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-full min-w-0 flex-col">
        <header className="flex flex-shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-6 py-3.5">
          <button
            type="button"
            className="hidden h-[34px] w-[34px] items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] max-[900px]:inline-flex"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>

          <h1 className="m-0 flex-1 text-[17px] font-semibold">{pageTitle}</h1>

          {profile && (
            <div className="flex items-center gap-2">
              <span className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--primary-soft)] text-[13px] font-bold text-[var(--primary)]">
                {profile.username.charAt(0).toUpperCase()}
              </span>
              <span className="text-[13px] font-medium text-[var(--text-muted)] max-[560px]:hidden">
                {profile.username}
              </span>
            </div>
          )}
        </header>

        <main className="max-h-[91.5dvh] w-full overflow-y-auto p-6 max-[900px]:max-h-none max-[900px]:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardLayout />
    </RequireAuth>
  )
}
