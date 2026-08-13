import { Loader2, LogOut } from 'lucide-react'

export default function LogoutButton({
  collapsed,
  closing,
  onLogout,
}: {
  collapsed?: boolean
  closing: boolean
  onLogout: () => void
}) {
  return (
    <button
      onClick={onLogout}
      disabled={closing}
      title={collapsed ? 'Cerrar sesión' : undefined}
      className={`flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-900/20 ${
        collapsed ? 'px-0' : ''
      }`}
    >
      {closing ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        <LogOut size={16} />
      )}
      {!collapsed && 'Cerrar sesión'}
    </button>
  )
}
