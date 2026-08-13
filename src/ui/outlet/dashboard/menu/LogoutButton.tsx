import { Loader2, LogOut } from 'lucide-react'

export default function LogoutButton({
  closing,
  onLogout,
}: {
  closing: boolean
  onLogout: () => void
}) {
  return (
    <button
      onClick={onLogout}
      disabled={closing}
      className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-900/20"
    >
      {closing ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        <LogOut size={16} />
      )}
      Cerrar sesión
    </button>
  )
}
