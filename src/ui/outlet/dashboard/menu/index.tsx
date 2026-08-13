import MenuPanel from './MenuPanel'
import { useDashboardMenu } from './useDashboardMenu'

/**
 * Menú único para desktop y mobile: mismo componente, mismo estado `open`.
 *
 * - Mobile (< lg): flota como drawer -> `fixed`, con sombra y backdrop,
 *   se abre/cierra deslizándose (`translate-x`).
 * - Desktop (>= lg): vive en el flujo -> `lg:static`, sin backdrop ni
 *   sombra, se abre/cierra colapsando su ancho (`w-64` <-> `w-0`), por lo
 *   que "empuja" el contenido en vez de flotar sobre él.
 *
 * En ambos casos el menú termina completamente oculto cuando `open` es
 * falso; la diferencia es solo cómo se oculta.
 */
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
        className={`fixed inset-0 z-4000 bg-black/40 transition-opacity duration-300 lg:hidden ${
          open
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 z-5000 flex h-dvh w-72 max-w-[85vw] flex-col overflow-hidden border-r border-gray-100 bg-white shadow-xl transition-transform duration-300 ease-in-out will-change-transform lg:static lg:z-auto lg:max-w-none lg:translate-x-0 lg:shadow-none lg:transition-[width] lg:duration-300 lg:ease-in-out dark:border-neutral-800 dark:bg-neutral-900 ${open ? 'translate-x-0' : '-translate-x-full'} ${open ? 'lg:w-64 lg:border-r' : 'lg:w-0 lg:border-r-0'}`}
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
