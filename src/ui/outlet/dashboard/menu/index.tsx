import { ChevronLeft, ChevronRight } from 'lucide-react'
import MenuPanel from './MenuPanel'
import { useDashboardMenu } from './useDashboardMenu'

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
  const {
    profile,
    loading,
    role,
    closingSession,
    selectedKeys,
    handleLogout,
    handleNavigate,
  } = useDashboardMenu()

  return (
    <>
      {/* Sidebar de escritorio */}
      <aside className="relative hidden h-dvh shrink-0 lg:flex">
        <div
          className={`flex h-dvh flex-col border-r border-gray-100 bg-white transition-all duration-300 ease-out dark:border-neutral-800 dark:bg-neutral-900 ${
            collapsed ? 'w-20' : 'w-64'
          }`}
        >
          <MenuPanel
            collapsed={collapsed}
            role={role}
            username={profile?.username}
            loadingProfile={loading.profile}
            selectedKeys={selectedKeys}
            closingSession={closingSession}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
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

      {/* Overlay móvil */}
      <div
        className={`fixed inset-0 z-4000 bg-black/40 transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={onCloseMobile}
      />

      {/* Drawer móvil */}
      <div
        className={`fixed top-0 left-0 z-5000 flex h-dvh w-72 max-w-[85vw] flex-col border-r border-gray-100 bg-white shadow-xl transition-transform duration-300 ease-out lg:hidden dark:border-neutral-800 dark:bg-neutral-900 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <MenuPanel
          collapsed={false}
          role={role}
          username={profile?.username}
          loadingProfile={loading.profile}
          selectedKeys={selectedKeys}
          closingSession={closingSession}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onClose={onCloseMobile}
        />
      </div>
    </>
  )
}
