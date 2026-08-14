import MenuPanel from './MenuPanel'
import { useDashboardMenu } from './useDashboardMenu'

export default function DashboardMenu({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
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
      <div
        className={`fixed inset-0 z-4000 bg-[var(--bg-base)]/60 transition-opacity duration-300 lg:hidden ${
          open
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`border-default fixed top-0 left-0 z-5000 flex h-dvh w-72 max-w-[85vw] flex-col overflow-hidden border-r bg-[var(--bg-elevated)] shadow-[0_20px_45px_rgba(15,23,42,0.16)] transition-transform duration-300 ease-in-out will-change-transform lg:static lg:z-auto lg:max-w-none lg:translate-x-0 lg:shadow-none lg:transition-[width] lg:duration-300 lg:ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'} ${open ? 'lg:w-64 lg:border-r' : 'lg:w-0 lg:border-r-0'}`}
      >
        <MenuPanel
          role={role}
          username={profile?.username}
          loadingProfile={loading.profile}
          selectedKeys={selectedKeys}
          closingSession={closingSession}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </aside>
    </>
  )
}
