import { Loader2 } from 'lucide-react'

export default function ProfileBlock({
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
